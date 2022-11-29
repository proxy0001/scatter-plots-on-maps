import * as React from 'react';
import Head from 'next/head'
import { useState, Fragment } from 'react'
import { Panel } from '../components/'
import { ScatterMap, ScatterMapProps, HoverInfo, defaultHoverInfo } from '../components/ScatterMap'
import { MultiSelect, MultiSelectProps } from '../components/MultiSelect'
import { MultiRangeSlider, MultiRangeSliderProps } from '../components/MultiRangeSlider'
import { filterProducer, rgba2hex, timestampFormatter, unixTimestampToTimeOfDate, TimeUnit } from '../utils/helper'
import sampleData from '../sampleData.json' assert {type: 'json'}

type TooltipInfo = {
  city?: string,
  homeCountry?: string,
  imei?: string,
  unixTimestamp?: string,
}

type periodConfig = {
  min: number,
  max: number,
  unit: TimeUnit,
  hoursHandler: (v: number) => number
  minutesHandler: (v: number) => number
}

const periodUnit: TimeUnit = 'hour'
const periodConfig = ((unit: TimeUnit): periodConfig => {
  const periodConfigs = {
    hour: {
      min: 0,
      max: 24,
      unit: 'hour',
      hoursHandler: (v: number) => v,
      minutesHandler: (v: number) => 0
    } as periodConfig,
    minute: {
      min: 0,
      max: 60 * 24,
      unit: 'hour',
      hoursHandler: (v: number) => v / 60,
      minutesHandler: (v: number) => v % 60
    } as periodConfig,
  }
  return periodConfigs[unit]
})(periodUnit)

const countryOptions: MultiSelectProps['options'] = [
  {value: 'Taiwan', text: 'Taiwan', defaultChecked: true},
  {value: 'China', text: 'China', defaultChecked: true},
  {value: 'Hong Kong', text: 'Hong Kong', defaultChecked: true},
  {value: 'Japen', text: 'Japen', defaultChecked: true},
  {value: 'Korean', text: 'Korean', defaultChecked: true},
  {value: 'Others', text: 'Others', defaultChecked: true},
]
const defaultChecked = countryOptions.reduce((acc: string[], cur) => {
  if (!cur || !cur.defaultChecked) return acc
  acc.push(cur.value)
  return acc
}, [])

const propertiesHandler = (d: object) => {
  return {
    imei: d['imei' as keyof typeof d],
    homeCountry: d['homeCountry' as keyof typeof d],
    unixTimestamp: d['unixTimestamp' as keyof typeof d],
    timeOfDate: unixTimestampToTimeOfDate(d['unixTimestamp' as keyof typeof d], periodUnit)
  }
}

const category = countryOptions.map(x => x.value)
const categoryName = 'homeCountry'

export default function Home() {
  const defaultFilter = filterProducer.addFilter(1, 'in', categoryName, ...defaultChecked) as ScatterMapProps['filter']
  const [filter, setFilter] = useState<ScatterMapProps['filter']>(defaultFilter)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(defaultHoverInfo)
  const {homeCountry, imei, unixTimestamp}: TooltipInfo = hoverInfo.properties

  const onMultiSelectChange: MultiSelectProps['onChange'] = selected => {
    let newFilter
    if (selected.size === 0) newFilter = filterProducer.addFilter(1, 'in', categoryName)
    else newFilter = filterProducer.addFilter(1, 'in', categoryName, ...Array.from(selected))
    setFilter(newFilter as ScatterMapProps['filter'])
  }  
  const onRangeChange: MultiRangeSliderProps['onChange'] = (min, max) => {
    let newFilter
    newFilter = filterProducer.addFilter(2, '>=', 'timeOfDate', min)
    newFilter = filterProducer.addFilter(3, '<=', 'timeOfDate', max)
    setFilter(newFilter as ScatterMapProps['filter'])
  }
  const onMouseOn: ScatterMapProps['onMouseOn'] = (hoverInfo: HoverInfo) => {
    setHoverInfo(hoverInfo)
  }
  const onMouseOut: ScatterMapProps['onMouseOut'] = () => {
    setHoverInfo(defaultHoverInfo)
  }

  return (
    <div>
      <Head>
        <title>Scatter Map</title>
        <meta name="description" content="Scatter Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-row w-full items-stretch min-h-screen">
        <div className="w-full pr-64">
          <ScatterMap
            data={sampleData}
            filter={filter}
            categoryName={categoryName}
            categoryItems={category}
            propertiesHandler={propertiesHandler}
            onMouseOn={onMouseOn}
            onMouseOut={onMouseOut}
            tooltipContent={
              <Fragment>
                <div className="text-base my-1.5 flex items-center">
                  {homeCountry && (
                    <Fragment>
                      <div className={`rounded-full w-4 h-4 bg-gray-700 border-2 border-stone-200 mr-1.5`}
                        style={hoverInfo.circleColor ? {backgroundColor: rgba2hex(hoverInfo.circleColor)} : {}}></div>
                      <div>{homeCountry}</div>
                    </Fragment>
                  )}
                </div>
                <div className="text-[13px] my-1 break-all">{imei}</div>
                <div className="text-[13px] my-1">{unixTimestamp && timestampFormatter(unixTimestamp)}</div>
              </Fragment>
            }
          />
        </div>
        <aside className="fixed top-0 right-0 w-64 h-full flex flex-col bg-stone-200 px-4 py-2">
          <div className="text-2xl text-center pt-1 pb-2 text-gray-700">Filter</div>
          <Panel title="Country / Region">
            <MultiSelect options={countryOptions} name="country"
              onChange={onMultiSelectChange}/>
          </Panel>
          <Panel title="Period">
            <MultiRangeSlider min={periodConfig.min} max={periodConfig.max} name="period"
              onChange={onRangeChange}
              format={val => {
                const hour = (Math.floor(periodConfig.hoursHandler(val))).toString().padStart(2, '0')
                const minute = (periodConfig.minutesHandler(val)).toString().padStart(2, '0')
                return `${hour}:${minute}`
              }}/>
          </Panel>
        </aside>
      </main>
    </div>
  )
}
