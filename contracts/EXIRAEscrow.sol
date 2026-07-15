// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

interface IEXIRAOracle {
    function verifyExecution(bytes32 signalId) external view returns (bool, uint256, uint256);
}

/// @title EXIRAEscrow
/// @notice Two-state atomic escrow for cross-chain BTCP transactions
contract EXIRAEscrow {

    enum EscrowState { IDLE, HOLDING, RELEASED, REVERTED }

    struct EscrowRecord {
        bytes32 intentHash;
        bytes32 entityId;
        uint256 amount;
        address token;         // address(0) for native ETH/OKB
        uint256 lockBlock;
        uint256 timeoutBlocks;
        EscrowState state;
        address destination;
        address depositor;
    }

    IEXIRAOracle public immutable exiraOracle;
    mapping(bytes32 => EscrowRecord) public escrows;

    event EscrowLocked(
        bytes32 indexed escrowId,
        bytes32 indexed entityId,
        uint256 amount,
        uint256 expiresBlock
    );
    event EscrowReleased(bytes32 indexed escrowId, bytes32 indexed entityId, uint256 amount);
    event EscrowReverted(bytes32 indexed escrowId, bytes32 indexed entityId, uint256 amount);

    error EscrowAlreadyExists();
    error NotHolding();
    error TimeoutNotReached();
    error ConsensusInvalid();
    error CoherenceBelowThreshold(uint256 coherence, uint256 threshold);
    error TransferFailed();

    constructor(address oracle) {
        exiraOracle = IEXIRAOracle(oracle);
    }

    function lock(
        bytes32 intentHash,
        bytes32 entityId,
        uint256 timeoutBlocks,
        address destination
    ) external payable returns (bytes32) {
        bytes32 escrowId = keccak256(abi.encodePacked(intentHash, entityId, block.timestamp, msg.sender));

        if (escrows[escrowId].state != EscrowState.IDLE) revert EscrowAlreadyExists();
        require(msg.value > 0, "Must lock non-zero amount");
        require(destination != address(0), "Invalid destination");
        require(timeoutBlocks > 0 && timeoutBlocks <= 50400, "Invalid timeout"); // max ~7 days

        escrows[escrowId] = EscrowRecord({
            intentHash: intentHash,
            entityId: entityId,
            amount: msg.value,
            token: address(0),
            lockBlock: block.number,
            timeoutBlocks: timeoutBlocks,
            state: EscrowState.HOLDING,
            destination: destination,
            depositor: msg.sender
        });

        emit EscrowLocked(escrowId, entityId, msg.value, block.number + timeoutBlocks);
        return escrowId;
    }

    function release(bytes32 escrowId, bytes32 routeSignal) external {
        EscrowRecord storage record = escrows[escrowId];
        if (record.state != EscrowState.HOLDING) revert NotHolding();

        (bool isSafe, uint256 coherence, uint256 threshold) = exiraOracle.verifyExecution(routeSignal);
        if (!isSafe) revert ConsensusInvalid();
        if (coherence < threshold) revert CoherenceBelowThreshold(coherence, threshold);

        record.state = EscrowState.RELEASED;
        (bool success, ) = payable(record.destination).call{value: record.amount}("");
        if (!success) revert TransferFailed();

        emit EscrowReleased(escrowId, record.entityId, record.amount);
    }

    function revertOnTimeout(bytes32 escrowId) external {
        EscrowRecord storage record = escrows[escrowId];
        if (record.state != EscrowState.HOLDING) revert NotHolding();
        if (block.number <= record.lockBlock + record.timeoutBlocks) revert TimeoutNotReached();

        record.state = EscrowState.REVERTED;
        (bool success, ) = payable(record.depositor).call{value: record.amount}("");
        if (!success) revert TransferFailed();

        emit EscrowReverted(escrowId, record.entityId, record.amount);
    }

    function getEscrow(bytes32 escrowId) external view returns (EscrowRecord memory) {
        return escrows[escrowId];
    }
}
