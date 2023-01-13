import * as parser from 'xml2json';
import * as fs from 'fs';
import { Kml } from '@src/routes/shared/types';

function getLocationJson() {
    let cache: { kml: Kml } | undefined = undefined;
    if (!fs.existsSync('asset.kml')) {
        //create new file if not exist
        fs.closeSync(fs.openSync('asset.kml', 'w'));
    }

    return (): Promise<{ kml: Kml }> => {
        if (cache) {
            return Promise.resolve(cache);
        }
        return new Promise((res, rej) => {
            fs.readFile('asset.kml', (err, data) => {
                if (err) {
                    rej(err);
                }
                cache = JSON.parse(parser.toJson(data)) as { kml: Kml };
                res(cache);
            });
        })
    };

}

export default {
    getLocationJson: getLocationJson(),
} as const;