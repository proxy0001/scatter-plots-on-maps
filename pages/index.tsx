import * as React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Panel, MultiRangeSlider, MultiSelect } from '../components/'

type MultiSelectOptions = React.ComponentProps<typeof MultiSelect>['options'];

export default function Home() {
  const countryOptions:MultiSelectOptions = [
    {value: 'taiwan', text: 'Taiwan', defaultChecked: true},
    {value: 'china', text: 'China', disabled: true},
    {value: 'hong kong', text: 'Hong Kong'},
    {value: 'japen', text: 'Japen'},
    {value: 'korean', text: 'Korean'},
    {value: 'others', text: 'Others'},
  ]
  return (
    <div>
      <Head>
        <title>Scatter Map</title>
        <meta name="description" content="Scatter Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-row w-full min-h-screen">
        <div className="basis-3/4 flex justify-center items-center">here is map</div>
        <div className="basis-1/4 flex flex-col bg-gray-200 px-4 py-2">
          <div className="text-2xl text-center pt-1 pb-2 text-gray-700">Filter</div>
          <Panel title="Country / Region">
            <MultiSelect options={countryOptions} name="country"
              onChange={(selected) => console.log(selected)}/>
          </Panel>
          <Panel title="Period">
            <MultiRangeSlider min={0} max={60 * 24} name="period"
              onChange={(min, max) => console.log(min, max)}
              format={val => {
                const hour = (Math.floor(val / 60)).toString().padStart(2, '0')
                const minute = (val % 60).toString().padStart(2, '0')
                return `${hour}:${minute}`
              }}/>
          </Panel>
        </div>
      </main>
    </div>
  )
}
