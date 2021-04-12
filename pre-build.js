const {
    Observable,
} = require('rxjs');
const {
    mergeMap,
} = require('rxjs/operators');
const folderHash = require('folder-hash');
const fs = require('fs-extra');

const options = {
    files: { include: ['*.js', '*.json', '*.sql'] },
};
// const writeJson = from(fs.writeJson);
const filename = 'hash.json';
const dataDirectory = './datas';
new Observable((subscriber) => {
    folderHash.hashElement(dataDirectory, options)
        .then((s) => subscriber.next(s))
        .catch((s) => subscriber.error(s))
        .finally(() => subscriber.complete());
})
    .pipe(
        mergeMap((json) => new Observable(
            (subscriber) => fs.writeJson(`${dataDirectory}/${filename}`, json)
                .then(() => subscriber.next(filename))
                .catch((s) => subscriber.error(s))
                .finally(() => subscriber.complete()),
        )),
    )
    .subscribe((hash) => {
        console.log(`Fichier de hash created : ${hash}`);
    },
    (error) => console.error('hashing failed:', error));
