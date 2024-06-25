export interface Loc {
    type: string; // "FeatureCollection"
    features: Feature[];
    query: {
      lat: number;
      lon: number;
      plus_code?: string; // Optional property
    };
  }
  
  interface Feature {
    type: string; // "Feature"
    properties: Properties;
    geometry: {
      type: string; // "Point"
      coordinates: [number, number]; // [longitude, latitude]
    };
    bbox?: number[]; // Optional property, bounding box coordinates
  }
  
  interface Properties {
    datasource: {
      sourcename: string;
      attribution: string;
      license: string;
      url: string;
    };
    name: string;
    country: string;
    country_code: string;
    state?: string; // Optional property
    state_district?: string; // Optional property
    county?: string; // Optional property
    city: string;
    postcode?: string; // Optional property
    district?: string; // Optional property
    suburb?: string; // Optional property
    street?: string; // Optional property
    housenumber?: string; // Optional property
    lon: number;
    lat: number;
    state_code?: string; // Optional property
    distance?: number; // Optional property
    result_type?: string; // Optional property
    formatted: string;
    address_line1: string;
    address_line2: string;
    category: string;
    timezone: {
      name: string;
      offset_STD: string;
      offset_STD_seconds: number;
      offset_DST: string;
      offset_DST_seconds: number;
      abbreviation_STD: string;
      abbreviation_DST: string;
    };
    plus_code?: string; // Optional property
    plus_code_short?: string; // Optional property
    rank: {
      importance: number;
      popularity: number;
    };
    place_id: string;
  }
  