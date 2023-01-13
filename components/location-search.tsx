"use client"
import { faCircleExclamation, faLocationArrow, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { catchError, debounceTime, filter, from, fromEvent, map, mergeMap, of, startWith, tap } from "rxjs";

function LocationSearch({ onMarkerSelect }: { onMarkerSelect: (data: { name: string, coordinates: string }) => void }) {
    const [_search, setSearch] = useState('');
    const [outlets, setOutlets] = useState({ status: ApiStatus.done, data: undefined as Placemark[] | undefined });
    const search$ = fromEvent(document.getElementsByName('search'), 'input')


    useEffect(() => {
        const sub = search$.pipe(
            map((e: any) => e.target.value),
            startWith(''),
            tap(val => {
                if (!val || val?.length < 1) {
                    setOutlets({ data: [], status: ApiStatus.done });
                }
            }),
            filter(val => !!val),
            debounceTime(500),
            tap((val) => {
                setSearch(val);
                setOutlets(old => ({ ...old, status: ApiStatus.loading }))
            }),
            mergeMap(val => {
                return from(axios.get('http://localhost:8080/api/outlet', { params: { address: val } }))
                    .pipe(
                        catchError((err: AxiosError) => {
                            return of(err)
                        })
                    );
            })
        ).subscribe(val => {
            if ('data' in val) {
                setOutlets({ data: val.data, status: ApiStatus.done });
            } else if (val.status === HttpStatusCode.NotFound) {
                setOutlets({ data: [{ name: 'not found', poly_id: '' }], status: ApiStatus.error });
            } else {
                setOutlets({ data: [], status: ApiStatus.error });
            }
        });
        return () => sub.unsubscribe();
    }, []);

    function searchIcon() {
        switch (outlets.status) {
            case ApiStatus.done:
                return faLocationArrow;
            case ApiStatus.loading:
                return faSpinner;
            case ApiStatus.error:
                return faCircleExclamation;
            default:
                return faLocationArrow;
        }
    }

    function handleLocationClick(val: Placemark) {
        if (val.Point && 'coordinates' in val.Point) {
            onMarkerSelect({ name: val.poly_id, coordinates: val.Point.coordinates });
            setOutlets({ data: [], status: ApiStatus.done });
        }
    }

    return (
        <section className="relative">
            <div className="mt-4 rounded-md drop-shadow-md overflow-hidden w-full flex items-center bg-white gap-3 px-3 py-5">
                <input className='block w-full outline-none text-blue-500' name='search' type="search" placeholder='Banglore, India' />
                <div className="font-semibold text-xl text-blue-700">
                    <FontAwesomeIcon icon={searchIcon()} />
                </div>
            </div>
            <div className="grid rounded-md mt-0.5">
                {outlets.data?.map((val: Placemark) => <div className='bg-white border border-t-0 border-blue-100 p-3 hover:bg-blue-100 transition' role='button' key={Math.random()} onClick={() => handleLocationClick(val)}><p>{val.name}</p></div>)}
            </div>
        </section>
    )
}

enum ApiStatus {
    loading = 'loading',
    error = 'error',
    done = 'done'
}

interface Placemark {
    name: string;
    description?: string;
    poly_id: string;
    Point?: {
        coordinates: string;
    }
}


export default LocationSearch