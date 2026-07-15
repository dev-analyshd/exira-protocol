// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EXIRAOracle
/// @notice Main signal publication contract. Emits behavioral truth signals when coherence threshold is met.
contract EXIRAOracle is Ownable {

    enum SignalType {
        VALUATION,
        SILENCE,
        LIQUIDITY_HEALTH,
        MANIPULATION_ALERT,
        EXIRA_FINANCE,
        EXIRA_VERIFY,
        EXIRA_BRIDGE,
        EXIRA_GUARD,
        EXIRA_SOCIAL,
        EXIRA_LEARN,
        EXIRA_SENSE,
        BTCP_ROUTE,
        BEHAVIORAL_TRUTH,
        LIQUIDITY_OCEAN,
        CONSENSUS_ADAPTATION,
        CHAIN_RELIABILITY
    }

    enum PlaneType {
        PHYSICAL,
        MENTAL,
        SPIRITUAL,
        CONSCIOUS,
        ANIMA
    }

    struct EXIRASignal {
        bytes32 signalId;
        SignalType signalType;
        bytes32 entityId;
        uint256 signalValue;
        uint256 ci95Lower;
        uint256 ci95Upper;
        uint256 coherence;     // scaled by 1000 (e.g. 847 = 0.847)
        uint256 threshold;     // scaled by 1000
        uint256 margin;        // coherence - threshold, scaled by 1000
        PlaneType limitingPlane;
        uint256 timestamp;
        uint256 blockNumber;
        bytes32 genomicSignature;
        bytes32[] provenance;
    }

    mapping(bytes32 => EXIRASignal) public signals;
    mapping(bytes32 => bool) public verifiedSignals;

    event SignalEmitted(
        bytes32 indexed signalId,
        SignalType indexed signalType,
        bytes32 indexed entityId,
        uint256 coherence,
        uint256 threshold
    );

    event SilenceEmitted(
        bytes32 indexed signalId,
        bytes32 indexed entityId,
        uint256 coherenceGap,
        PlaneType limitingPlane,
        uint256 eta
    );

    uint256 public constant THETA_MIN = 550; // 0.55 * 1000
    uint256 public constant THETA_MAX = 920; // 0.92 * 1000

    constructor() Ownable(msg.sender) {}

    function emitSignal(EXIRASignal calldata signal) external onlyOwner {
        require(signal.coherence >= signal.threshold, "Coherence below threshold");
        require(signal.coherence <= 1000, "Coherence out of range");
        require(signal.threshold >= THETA_MIN && signal.threshold <= THETA_MAX, "Threshold out of range");

        signals[signal.signalId] = signal;
        verifiedSignals[signal.signalId] = true;

        emit SignalEmitted(
            signal.signalId,
            signal.signalType,
            signal.entityId,
            signal.coherence,
            signal.threshold
        );
    }

    function emitSilence(
        bytes32 signalId,
        bytes32 entityId,
        uint256 coherenceGap,
        PlaneType limitingPlane,
        uint256 eta
    ) external onlyOwner {
        emit SilenceEmitted(signalId, entityId, coherenceGap, limitingPlane, eta);
    }

    function verifyExecution(bytes32 signalId) external view returns (bool, uint256, uint256) {
        EXIRASignal memory signal = signals[signalId];
        bool isSafe = signal.coherence >= signal.threshold;
        return (isSafe, signal.coherence, signal.threshold);
    }

    function getSignal(bytes32 signalId) external view returns (EXIRASignal memory) {
        return signals[signalId];
    }
}
