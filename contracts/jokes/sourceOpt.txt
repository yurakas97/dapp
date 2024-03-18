//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "../base/CustomChanIbcApp.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title nft-mint
 * @dev Implements minting process,
 * and ability to send cross-chain instruction to mint NFT on counterparty
 */
contract OptContract is CustomChanIbcApp {
    enum IbcPacketStatus {
        UNSENT,
        SENT,
        ACKED,
        TIMEOUT
    }

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted; // if true, that person already voted;
        address delegate; // person delegated to
        uint vote; // index of the voted proposal
        // additional
        IbcPacketStatus ibcPacketStatus;
        uint[] voteNFTIds;
    }

    struct Proposal {
        // If you can limit the length to a certain number of bytes,
        // always use one of bytes1 to bytes32 because they are much cheaper
        bytes32 name; // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Not chairperson.");
        _;
    }

    event Voted(address indexed voter, uint proposal); // Exposing the vote information for debugging; hide in production if you want private voting
    event SendVoteInfo(
        bytes32 channelId,
        address indexed voter,
        string str,
        uint proposal
    );
    event AckNFTMint(
        bytes32 channelId,
        uint sequence,
        address indexed voter,
        uint voteNFTid
    );

    /**
     * @dev Create a new ballot to choose one of 'proposalNames' and make it IBC enabled to send proof of Vote to counterparty
     * @param _dispatcher vIBC dispatcher contract
     * @param proposalNames names of proposals
     */
    constructor(
        IbcDispatcher _dispatcher,
        bytes32[] memory proposalNames
    ) CustomChanIbcApp(_dispatcher) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            // 'Proposal({...})' creates a temporary
            // Proposal object and 'proposals.push(...)'
            // appends it to the end of 'proposals'.
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    /**
     * @dev Give 'voter' the right to vote on this ballot. May only be called by 'chairperson'.
     * @param voter address of voter
     */
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /**
     * @dev Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'.
     * @param proposal index of proposal in the proposals array
     */
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        // FOR TESTING ONLY
        // ----------------
        sender.weight = 1;
        sender.ibcPacketStatus = IbcPacketStatus.UNSENT;
        require(sender.weight != 0, "Has no right to vote");
        // require(!sender.voted, "Already voted.");
        // ----------------
        sender.voted = true;
        sender.vote = proposal;

        // If 'proposal' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;

        emit Voted(msg.sender, proposal);
    }

    // IBC methods

    /**
     * @dev Sends a packet with a greeting message over a specified channel.
     * @param channelId The ID of the channel to send the packet to.
     * @param timeoutSeconds The timeout in seconds (relative).
     * @param voterAddress the address of the voter
     * @param str recipient the address on the destination (Base) that will have NFT minted
     */
    function sendPacket(
        bytes32 channelId,
        uint64 timeoutSeconds,
        address voterAddress,
        string memory str
    ) external //address recipient
    {
        Voter storage voter = voters[voterAddress];
        require(
            voter.ibcPacketStatus == IbcPacketStatus.UNSENT ||
                voter.ibcPacketStatus == IbcPacketStatus.TIMEOUT,
            "An IBC packet relating to his vote has already been sent. Wait for acknowledgement."
        );

        uint proposal = voter.vote;
        bytes memory payload = abi.encode(voterAddress, str);

        uint64 timeoutTimestamp = uint64(
            (block.timestamp + timeoutSeconds) * 1000000000
        );

        dispatcher.sendPacket(channelId, payload, timeoutTimestamp);
        voter.ibcPacketStatus = IbcPacketStatus.SENT;

        emit SendVoteInfo(channelId, voterAddress, str, proposal);
    }

    function onRecvPacket(
        IbcPacket memory
    )
        external
        view
        override
        onlyIbcDispatcher
        returns (AckPacket memory ackPacket)
    {
        require(false, "This function should not be called");

        return
            AckPacket(
                true,
                abi.encode("Error: This function should not be called")
            );
    }

    function onAcknowledgementPacket(
        IbcPacket calldata packet,
        AckPacket calldata ack
    ) external override onlyIbcDispatcher {
        ackPackets.push(ack);

        // decode the ack data, find the address of the voter the packet belongs to and set ibcNFTMinted true
        (address voterAddress, uint256 voteNFTid) = abi.decode(
            ack.data,
            (address, uint256)
        );
        voters[voterAddress].ibcPacketStatus = IbcPacketStatus.ACKED;
        voters[voterAddress].voteNFTIds.push(voteNFTid);

        emit AckNFTMint(
            packet.src.channelId,
            packet.sequence,
            voterAddress,
            voteNFTid
        );
    }

    function onTimeoutPacket(
        IbcPacket calldata packet
    ) external override onlyIbcDispatcher {
        timeoutPackets.push(packet);
        // do logic
    }
}
