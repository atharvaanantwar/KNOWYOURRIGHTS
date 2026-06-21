# Central reference links configuration by domain

DOMAIN_REFERENCES = {
    "consumer_rights": [
        {
            "title": "Consumer Protection Act, 2019 - Official Text",
            "url": "https://www.indiacode.nic.in/handle/123456789/15256",
            "description": "Official full-text of the Consumer Protection Act, 2019"
        }
    ],
    "women_safety": [
        {
            "title": "Protection of Women from Domestic Violence Act - Official Text",
            "url": "https://www.indiacode.nic.in/handle/123456789/2021",
            "description": "Official full-text of the Protection of Women from Domestic Violence Act"
        }
    ]
}


def get_references_by_domain(domain: str) -> list:
    """
    Fetch references for a specific domain.
    
    Args:
        domain: The topic/domain name (e.g., 'consumer_rights', 'women_safety')
    
    Returns:
        List of reference dictionaries for that domain
    """
    return DOMAIN_REFERENCES.get(domain, [])
