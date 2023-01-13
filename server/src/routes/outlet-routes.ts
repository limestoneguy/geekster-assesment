import { validationResult } from "express-validator";
import { IReqQuery, IRes, Kml, Placemark } from "./shared/types";
import locationUtils from '../util/location-utils';
import NodeGeocoder = require('node-geocoder');
import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";

const options: NodeGeocoder.Options = {
    provider: "openstreetmap",
};

const geoCoder = NodeGeocoder(options);

// Paths
const paths = {
    getOutlet: '/outlet',
} as const;

// types
type outletReq = {
    address: string
}

async function getNearestOutlet(req: IReqQuery<outletReq>, res: IRes, next: (err: Error) => void) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    const geoGuess = await geoCoder.geocode(address);
    const JSONData = await locationUtils.getLocationJson();
    const result = geoGuess.map((guess) => getGeoAddress(guess, JSONData)).filter(val => !!val);
    if (result.length < 1) return next(new RouteError(HttpStatusCodes.NOT_FOUND, 'not_found'));
    return res.status(200).json(result);
}

export default {
    paths,
    getNearestOutlet,
} as const;

function getGeoAddress(guess: NodeGeocoder.Entry, JSONData: { kml: Kml; }): Placemark | undefined {
    let resultString;
    JSONData.kml.Document.Placemark.forEach((val, index) => {
        const { longitude, latitude } = guess;
        if (val.Polygon && longitude && latitude) {
            const coordinates = val.Polygon.outerBoundaryIs.LinearRing.coordinates.split('\n').map(v => v.trim()).map(val => val.split(',').map(parseFloat));
            if (isPointInPoly(coordinates, [longitude, latitude])) {
                resultString = { ...JSONData.kml.Document.Placemark[index - 1], poly_id: val.name };
            }
        }
    });
    return resultString;
}

function isPointInPoly(poly: number[][], point: [number, number]) {
    const x = point[0], y = point[1];

    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];

        const intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}
