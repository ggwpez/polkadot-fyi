// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract EntryRegistry {

    // State variable to store contract creator
    address public creator;

    // Custom errors (saves gas compared to require strings)
    error AbbreviationExists();
    error EntryDoesNotExist();
    error AbbreviationTooShort();
    error AbbreviationTooLong();
    error TitleTooShort();
    error TitleTooLong();
    error DescriptionTooShort();
    error DescriptionTooLong();
    error InvalidCharacter();
    error Unauthorized();

    // Struct to define an entry (abbreviation is the key, so not stored here)
    struct Entry {
        string title;
        string description;
        // Removed 'exists' boolean - we check bytes(title).length > 0 instead
    }

    // Array to store all abbreviations (index)
    string[] public abbreviations;

    // Mapping from abbreviation to Entry
    mapping(string => Entry) public entries;

    /**
     * @dev Constructor sets the contract creator
     */
    constructor() {
        creator = msg.sender;
    }

    /**
     * @dev Modifier to restrict functions to only the contract creator
     */
    modifier onlyCreator() {
        if (msg.sender != creator) revert Unauthorized();
        _;
    }

    /**
     * @dev Add a new entry to the registry
     * @param _abbreviation Short form or code for the entry (used as key)
     * @param _title Full title of the entry
     * @param _description Detailed description of the entry
     */
    function addEntry(
        string calldata _abbreviation,  // Changed from memory to calldata
        string calldata _title,          // Changed from memory to calldata
        string calldata _description     // Changed from memory to calldata
    ) public {
        // Cache lengths for reuse
        uint256 abbrLen = bytes(_abbreviation).length;
        uint256 titleLen = bytes(_title).length;
        uint256 descLen = bytes(_description).length;

        // Reordered checks: cheaper operations first (length checks before string comparisons)
        if (abbrLen < 2) revert AbbreviationTooShort();
        if (abbrLen > 10) revert AbbreviationTooLong();
        if (titleLen < 3) revert TitleTooShort();
        if (titleLen > 100) revert TitleTooLong();
        if (descLen < 3) revert DescriptionTooShort();
        if (descLen > 1000) revert DescriptionTooLong();

        // Check that entry doesn't already exist (using title length instead of exists boolean)
        if (bytes(entries[_abbreviation].title).length != 0) revert AbbreviationExists();

        // Validate abbreviation contains only uppercase ASCII letters (A-Z)
        bytes calldata abbrBytes = bytes(_abbreviation);
        for (uint256 i = 0; i < abbrLen;) {  // Use cached length
            if (abbrBytes[i] < 0x41 || abbrBytes[i] > 0x5A) revert InvalidCharacter();
            unchecked { ++i; }  // Unchecked increment saves gas, won't overflow
        }

        // Create new entry in mapping
        entries[_abbreviation] = Entry({
            title: _title,
            description: _description
        });

        // Add abbreviation to index
        abbreviations.push(_abbreviation);
    }

    /**
     * @dev Edit an existing entry (only creator can call)
     * @param _abbreviation The abbreviation of the entry to edit
     * @param _title New title for the entry
     * @param _description New description for the entry
     */
    function editEntry(
        string calldata _abbreviation,
        string calldata _title,
        string calldata _description
    ) public onlyCreator {
        // Check that entry exists
        if (bytes(entries[_abbreviation].title).length == 0) revert EntryDoesNotExist();

        // Update entry
        entries[_abbreviation].title = _title;
        entries[_abbreviation].description = _description;
    }

    /**
     * @dev Delete an entry (only creator can call)
     * @param _abbreviation The abbreviation of the entry to delete
     */
    function deleteEntry(string calldata _abbreviation) public onlyCreator {
        // Check that entry exists
        if (bytes(entries[_abbreviation].title).length == 0) revert EntryDoesNotExist();

        // Delete entry from mapping
        delete entries[_abbreviation];

        // Remove abbreviation from array using swap-and-pop for gas efficiency
        uint256 length = abbreviations.length;
        for (uint256 i = 0; i < length;) {
            if (keccak256(bytes(abbreviations[i])) == keccak256(bytes(_abbreviation))) {
                // Swap with last element
                abbreviations[i] = abbreviations[length - 1];
                // Remove last element
                abbreviations.pop();
                break;
            }
            unchecked { ++i; }
        }
    }

    /**
     * @dev Get entry by abbreviation
     * @param _abbreviation The abbreviation to look up
     * return title, description, timestamp, creator
     */
    function getEntry(string calldata _abbreviation)  // Changed from memory to calldata
        public
        view
        returns (
            string memory title,
            string memory description
        )
    {
        Entry storage entry = entries[_abbreviation];  // Use storage pointer instead of copying to memory
        if (bytes(entry.title).length == 0) revert EntryDoesNotExist();  // Check existence using title length
        return (entry.title, entry.description);
    }

    /**
     * @dev Get all abbreviations
     * @return Array of all abbreviations
     */
    function getAllAbbreviations() public view returns (string[] memory) {
        return abbreviations;
    }

    /**
     * @dev Get the total number of entries
     * @return Total count of entries
     */
    function getEntryCount() public view returns (uint256) {
        return abbreviations.length;
    }

    /**
     * @dev Check if an abbreviation exists
     * @param _abbreviation The abbreviation to check
     * @return Boolean indicating if the entry exists
     */
    function entryExists(string calldata _abbreviation) public view returns (bool) {  // Changed from memory to calldata
        return bytes(entries[_abbreviation].title).length != 0;  // Check using title length instead of exists boolean
    }
}
