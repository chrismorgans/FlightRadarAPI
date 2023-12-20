const Entity = require("./entity");


const proxyHandler = {
    get: function(target, name) {
        return name in target? target[name] : target.__raw_information[name];
    }
};


class Airport extends Entity {
    /**
     * Airport representation.
     */
    
    static __default_text = "N/A"

    /**
     * Constructor of Airport class.
     * 
     * @param {object} info - Basic information about the airport
     * @param {object} details - Dictionary with more information about the airport
     */
    constructor(info = {}, details = {}) {
        if (info && Object.keys(info).length > 0) {
            this.__initializeWithBasicInfo(info);
        }

        if (details && Object.keys(details).length > 0) {
            this.__initializeWithDetails(details);
        }

        this.__raw_information = Object.assign(info, details);

        return new Proxy(this, proxyHandler);
    }

    /**
     * Initialize instance with basic information about the airport.
     */
    __initializeWithBasicInfo(info) {
        super(info["lat"], info["lon"]);

        this.altitude = info["alt"]

        this.name = info["name"]
        this.icao = info["icao"]
        this.iata = info["iata"]

        this.country = info["country"]
    }

    /**
     * Initialize instance with detailed information about the airport.
     */
    __initializeWithDetails(details) {
        super(details["position"]["latitude"], details["position"]["longitude"]);
        details = this.__createGetterMethodFor(details);

        this.altitude = details["position"]["altitude"];

        this.name = details["name"];
        this.icao = details["code"]["icao"];
        this.iata = details["code"]["iata"];

        // Location information.
        const position = this.__createGetterMethodFor(details["position"]);

        this.country = position["country"]["name"];
        this.country_code = this.__getInfo(position.get("country", {}).get("code"))
        this.city = this.__getInfo(position.get("region", {})).get("city")

        // Timezone information.
        const timezone = details.get("timezone", dict())

        this.timezone_name = this.__getInfo(timezone.get("name"))
        this.timezone_offset = this.__getInfo(timezone.get("offset"))
        this.timezone_offsetHours = this.__getInfo(timezone.get("offsetHours"))
        this.timezone_abbr = this.__getInfo(timezone.get("abbr"))
        this.timezone_abbr_name = this.__getInfo(timezone.get("abbrName"))

        // Other information.
        this.visible = this.__getInfo(details.get("visible"))
        this.website = this.__getInfo(details.get("website"))
    }
}