// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

/// @title EXIRARegistry
/// @notice Agent identity registration, reputation tracking, and verification badges
contract EXIRARegistry {

    struct AgentProfile {
        bytes32 agentId;
        address owner;
        uint256 registrationTime;
        uint256 behavioralDepth;      // D(t) — total behavioral events processed
        uint256 credibilityScore;     // CRED(t) — 0-1000 scaled
        uint256 reputationScore;      // Composite reputation — 0-1000 scaled
        bool isVerified;
        bool isMonitored;
        bytes32 genomicKey;
        bytes32[] linkedWallets;      // BEO cluster members
    }

    struct VerificationBadge {
        bytes32 badgeId;
        bytes32 agentId;
        uint256 issuedAt;
        uint256 expiresAt;
        uint8 manipulationRisk;       // 0-100
        bytes32 auditHash;
    }

    mapping(bytes32 => AgentProfile) public agents;
    mapping(bytes32 => VerificationBadge) public badges;
    mapping(address => bytes32) public ownerToAgent;
    bytes32[] public allAgentIds;

    event AgentRegistered(bytes32 indexed agentId, address indexed owner);
    event BadgeIssued(bytes32 indexed badgeId, bytes32 indexed agentId);
    event ReputationUpdated(bytes32 indexed agentId, uint256 newScore);
    event WalletLinked(bytes32 indexed agentId, bytes32 walletHash);

    function registerAgent(bytes32 agentId, bytes32 genomicKey) external {
        require(agents[agentId].registrationTime == 0, "Agent already exists");
        require(ownerToAgent[msg.sender] == bytes32(0), "Owner already has agent");

        agents[agentId] = AgentProfile({
            agentId: agentId,
            owner: msg.sender,
            registrationTime: block.timestamp,
            behavioralDepth: 0,
            credibilityScore: 500,
            reputationScore: 0,
            isVerified: false,
            isMonitored: false,
            genomicKey: genomicKey,
            linkedWallets: new bytes32[](0)
        });

        ownerToAgent[msg.sender] = agentId;
        allAgentIds.push(agentId);
        emit AgentRegistered(agentId, msg.sender);
    }

    function issueBadge(
        bytes32 badgeId,
        bytes32 agentId,
        uint8 manipulationRisk,
        bytes32 auditHash
    ) external {
        require(agents[agentId].registrationTime != 0, "Agent not registered");
        require(manipulationRisk <= 100, "Risk out of range");

        badges[badgeId] = VerificationBadge({
            badgeId: badgeId,
            agentId: agentId,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + 90 days,
            manipulationRisk: manipulationRisk,
            auditHash: auditHash
        });

        agents[agentId].isVerified = true;
        emit BadgeIssued(badgeId, agentId);
    }

    function updateReputation(bytes32 agentId, int256 delta) external {
        AgentProfile storage agent = agents[agentId];
        require(agent.registrationTime != 0, "Agent not registered");

        if (delta >= 0) {
            uint256 posDelta = uint256(delta);
            agent.reputationScore = agent.reputationScore + posDelta > 10000
                ? 10000
                : agent.reputationScore + posDelta;
            agent.credibilityScore = agent.credibilityScore + posDelta / 2 > 10000
                ? 10000
                : agent.credibilityScore + posDelta / 2;
        } else {
            uint256 absDelta = uint256(-delta);
            agent.reputationScore = agent.reputationScore > absDelta
                ? agent.reputationScore - absDelta
                : 0;
            agent.credibilityScore = agent.credibilityScore > absDelta / 2
                ? agent.credibilityScore - absDelta / 2
                : 0;
        }

        emit ReputationUpdated(agentId, agent.reputationScore);
    }

    function linkWallet(bytes32 agentId, bytes32 walletHash) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].linkedWallets.push(walletHash);
        emit WalletLinked(agentId, walletHash);
    }

    function getAgentCount() external view returns (uint256) {
        return allAgentIds.length;
    }
}
