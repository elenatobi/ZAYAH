import SockFetch
import json

BASE_LINK = "https://services.c.web.sl.se/api/v2/departures?origSiteId={}"
SUMMARY_LINK = "https://services.c.web.sl.se/api/trafficsituationsummaries"


def fetch_and_parse(url):
    """Fetches a URL and parses the JSON response body."""
    response = SockFetch.fetch_page(url)
    body = response["body"]
    return json.loads(body)


def filter_departures(departures, direction):
    """Filters and prints metro departures matching the given direction."""
    for departure in departures:
        transport = departure["transport"]
        if transport["transportType"] == "METRO" and transport["direction"] == direction and transport["destination"] != "\u00c5keshov":
            deviations = departure.get("deviations", [{}])[0].get("text", "")
            print(transport["destination"], departure["time"]["displayTime"], deviations)


def filter_traffic_situation_summary(transport_modes):
    """Filters and prints traffic situation summaries for green line"""
    for transport_mode in transport_modes:
        if transport_mode["title"] == "Gr\u00f6na linjen":
            prioritized_situation = transport_mode["prioritizedSituation"]
            print("Header:", prioritized_situation["header"])
            print("Details:", prioritized_situation["details"])
            print()


def main():
    locations = {"Brommaplan": "9109", "Blackeberg": "9105"}
    directions = {"Brommaplan": 1, "Blackeberg": 2}
    
    for location, site_id in locations.items():
        data = fetch_and_parse(BASE_LINK.format(site_id))
        print(f"--- Departures from {location}: ---")
        filter_departures(data, directions[location])
        print()
    
    traffic_data = fetch_and_parse(SUMMARY_LINK)
    print("--- Traffic situation summaries (Green line/Gr\u00f6na linjen) ---")
    filter_traffic_situation_summary(traffic_data)