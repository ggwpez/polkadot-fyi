// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract EntryRegistry {

    // Struct to define an entry (abbreviation is the key, so not stored here)
    struct Entry {
        string title;
        string description;
        bool exists;
    }

    // Array to store all abbreviations (index)
    string[] public abbreviations;

    // Mapping from abbreviation to Entry
    mapping(string => Entry) public entries;

    /**
     * @dev Add a new entry to the registry
     * @param _abbreviation Short form or code for the entry (used as key)
     * @param _title Full title of the entry
     * @param _description Detailed description of the entry
     */
    function addEntry(
        string memory _abbreviation,
        string memory _title,
        string memory _description
    ) public {
        // Check that entry doesn't already exist
        require(!entries[_abbreviation].exists, "Abbreviation already exists");

        require(bytes(_abbreviation).length >= 2, "Abbreviation must be at least 2 long");
        require(bytes(_abbreviation).length <= 10, "Abbreviation must be at most 10 characters");
        require(bytes(_title).length >= 3, "Title must be at least 3 long");
        require(bytes(_title).length <= 100, "Title must be at most 100 characters");
        require(bytes(_description).length >= 3, "Description must be at least 3 long");
        require(bytes(_description).length <= 1000, "Description must be at most 1000 characters");

        // Validate abbreviation contains only uppercase ASCII letters (A-Z)
        bytes memory abbrBytes = bytes(_abbreviation);
        for (uint i = 0; i < abbrBytes.length; i++) {
            require(abbrBytes[i] >= 0x41 && abbrBytes[i] <= 0x5A, "Abbreviation must contain only uppercase letters A-Z");
        }

        // Create new entry in mapping
        entries[_abbreviation] = Entry({
            title: _title,
            description: _description,
            exists: true
        });

        // Add abbreviation to index
        abbreviations.push(_abbreviation);
    }

    /**
     * @dev Get entry by abbreviation
     * @param _abbreviation The abbreviation to look up
     * return title, description, timestamp, creator
     */
    function getEntry(string memory _abbreviation)
        public
        view
        returns (
            string memory title,
            string memory description
        )
    {
        require(entries[_abbreviation].exists, "Entry does not exist");
        Entry memory entry = entries[_abbreviation];
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
    function entryExists(string memory _abbreviation) public view returns (bool) {
        return entries[_abbreviation].exists;
    }
}
