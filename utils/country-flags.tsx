import React from 'react'
import { hasFlag } from 'country-flag-icons'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

// Import specific flag components
import AU from 'country-flag-icons/react/3x2/AU' // Australia
import BH from 'country-flag-icons/react/3x2/BH' // Bahrain
import CN from 'country-flag-icons/react/3x2/CN' // China
import JP from 'country-flag-icons/react/3x2/JP' // Japan
import SA from 'country-flag-icons/react/3x2/SA' // Saudi Arabia
import US from 'country-flag-icons/react/3x2/US' // United States
import IT from 'country-flag-icons/react/3x2/IT' // Italy
import MC from 'country-flag-icons/react/3x2/MC' // Monaco
import ES from 'country-flag-icons/react/3x2/ES' // Spain
import CA from 'country-flag-icons/react/3x2/CA' // Canada
import AT from 'country-flag-icons/react/3x2/AT' // Austria
import GB from 'country-flag-icons/react/3x2/GB' // Great Britain
import HU from 'country-flag-icons/react/3x2/HU' // Hungary
import BE from 'country-flag-icons/react/3x2/BE' // Belgium
import NL from 'country-flag-icons/react/3x2/NL' // Netherlands
import AZ from 'country-flag-icons/react/3x2/AZ' // Azerbaijan
import SG from 'country-flag-icons/react/3x2/SG' // Singapore
import MX from 'country-flag-icons/react/3x2/MX' // Mexico
import BR from 'country-flag-icons/react/3x2/BR' // Brazil
import QA from 'country-flag-icons/react/3x2/QA' // Qatar
import AE from 'country-flag-icons/react/3x2/AE' // UAE
import ZA from 'country-flag-icons/react/3x2/ZA' // South Africa
import PT from 'country-flag-icons/react/3x2/PT' // Portugal
import FR from 'country-flag-icons/react/3x2/FR' // France
import DE from 'country-flag-icons/react/3x2/DE' // Germany
import TR from 'country-flag-icons/react/3x2/TR' // Turkey
import RU from 'country-flag-icons/react/3x2/RU' // Russia
import MY from 'country-flag-icons/react/3x2/MY' // Malaysia
import KR from 'country-flag-icons/react/3x2/KR' // Korea
import IN from 'country-flag-icons/react/3x2/IN' // India
import DK from 'country-flag-icons/react/3x2/DK' // Denmark
import FI from 'country-flag-icons/react/3x2/FI' // Finland
import TH from 'country-flag-icons/react/3x2/TH' // Thailand

// Flag components mapping
const flagComponents: Record<string, React.ComponentType<any>> = {
  AU, BH, CN, JP, SA, US, IT, MC, ES, CA, AT, GB, HU, BE, NL, AZ, SG, MX, BR, QA, AE, ZA, PT, FR, DE, TR, RU, MY, KR, IN, DK, FI, TH
}

// Country name to ISO 3166-1 alpha-2 code mapping for F1 countries
const countryNameToCode: Record<string, string> = {
  // F1 2024-2025 Calendar Countries
  'Australia': 'AU',
  'Bahrain': 'BH',
  'China': 'CN',
  'Japan': 'JP',
  'Saudi Arabia': 'SA',
  'Miami': 'US', // Miami GP is in USA
  'Emilia-Romagna': 'IT', // Imola is in Italy
  'Monaco': 'MC',
  'Spain': 'ES',
  'Canada': 'CA',
  'Austria': 'AT',
  'Great Britain': 'GB',
  'Hungary': 'HU',
  'Belgium': 'BE',
  'Netherlands': 'NL',
  'Italy': 'IT',
  'Azerbaijan': 'AZ',
  'Singapore': 'SG',
  'United States': 'US',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Qatar': 'QA',
  'Abu Dhabi': 'AE', // Abu Dhabi GP is in UAE
  'Las Vegas': 'US', // Las Vegas GP is in USA
  'South Africa': 'ZA',
  'Portugal': 'PT',
  'France': 'FR',
  'Germany': 'DE',
  'Turkey': 'TR',
  'Russia': 'RU',
  'Malaysia': 'MY',
  'Korea': 'KR',
  'India': 'IN',

  // Circuit locations to country mappings
  'Sakhir': 'BH', // Bahrain International Circuit
  'Jeddah': 'SA', // Saudi Arabia
  'Melbourne': 'AU', // Australia
  'Suzuka': 'JP', // Japan
  'Shanghai': 'CN', // China
  'Imola': 'IT', // Italy
  'Miami': 'US', // USA
  'Barcelona': 'ES', // Spain
  'Montreal': 'CA', // Canada
  'Spielberg': 'AT', // Austria
  'Silverstone': 'GB', // Great Britain
  'Budapest': 'HU', // Hungary
  'Spa-Francorchamps': 'BE', // Belgium
  'Zandvoort': 'NL', // Netherlands
  'Monza': 'IT', // Italy
  'Baku': 'AZ', // Azerbaijan
  'Marina Bay': 'SG', // Singapore
  'Austin': 'US', // USA
  'Mexico City': 'MX', // Mexico
  'São Paulo': 'BR', // Brazil
  'Losail': 'QA', // Qatar
  'Yas Marina': 'AE', // UAE

  // Alternative names and variations
  'UK': 'GB',
  'United Kingdom': 'GB',
  'Britain': 'GB',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'USA': 'US',
  'South Korea': 'KR',

  // 3-letter to 2-letter ISO country code mappings (for F1 API data)
  'NED': 'NL', // Netherlands
  'GBR': 'GB', // Great Britain
  'GER': 'DE', // Germany
  'MEX': 'MX', // Mexico
  'ESP': 'ES', // Spain
  'MON': 'MC', // Monaco
  'DEN': 'DK', // Denmark
  'JPN': 'JP', // Japan
  'CHN': 'CN', // China
  'THA': 'TH', // Thailand
  'FIN': 'FI', // Finland
  'CAN': 'CA', // Canada
  'FRA': 'FR', // France
}

export interface CountryFlagProps {
  countryName?: string
  countryCode?: string
  className?: string
  title?: string
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryName,
  countryCode: providedCountryCode,
  className = "w-6 h-4",
  title
}) => {
  // Use provided country code or get country code from mapping
  let countryCode = providedCountryCode || (countryName ? (countryNameToCode[countryName] || countryNameToCode[countryName.replace(/\s+/g, ' ').trim()]) : null)

  // If we have a country code, try to map it (in case it's a 3-letter code)
  if (countryCode && countryNameToCode[countryCode]) {
    countryCode = countryNameToCode[countryCode]
  }

  if (!countryCode) {
    // Final fallback to country initials or placeholder
    const fallbackText = countryName ? countryName.substring(0, 2).toUpperCase() : '??'
    return (
      <div
        className={`bg-gradient-to-r from-red-600 to-red-500 rounded-sm flex items-center justify-center ${className}`}
        title={title || countryName || 'Unknown Country'}
      >
        <span className="text-white text-xs font-bold">
          {fallbackText}
        </span>
      </div>
    )
  }

  // Check if flag exists
  if (!hasFlag(countryCode)) {
    const unicodeFlag = getUnicodeFlagIcon(countryCode)
    if (unicodeFlag) {
      return (
        <span
          className={`inline-block text-lg ${className}`}
          title={title || countryName || countryCode}
        >
          {unicodeFlag}
        </span>
      )
    }

    // Fallback to initials
    return (
      <div
        className={`bg-gradient-to-r from-red-600 to-red-500 rounded-sm flex items-center justify-center ${className}`}
        title={title || countryName || countryCode}
      >
        <span className="text-white text-xs font-bold">
          {countryCode}
        </span>
      </div>
    )
  }

  // Render the flag component
  return (
    <FlagComponent
      countryCode={countryCode}
      className={className}
      title={title || countryName}
    />
  )
}

interface FlagComponentProps {
  countryCode: string
  className?: string
  title?: string
}

const FlagComponent: React.FC<FlagComponentProps> = ({ countryCode, className, title }) => {
  const FlagIcon = flagComponents[countryCode]

  if (!FlagIcon) {
    // Fallback state
    return (
      <div
        className={`bg-gradient-to-r from-red-600 to-red-500 rounded-sm flex items-center justify-center ${className}`}
        title={title}
      >
        <span className="text-white text-xs font-bold">
          {countryCode}
        </span>
      </div>
    )
  }

  return (
    <FlagIcon
      className={className}
      title={title}
      style={{ display: 'inline-block' }}
    />
  )
}

// Helper function to get country code from country name
export const getCountryCode = (countryName: string): string | null => {
  return countryNameToCode[countryName] || countryNameToCode[countryName.replace(/\s+/g, ' ').trim()] || null
}

// Helper function to get country name from location (for display purposes)
export const getCountryNameFromLocation = (location: string): string => {
  const locationToCountry: Record<string, string> = {
    'Sakhir': 'Bahrain',
    'Jeddah': 'Saudi Arabia',
    'Melbourne': 'Australia',
    'Suzuka': 'Japan',
    'Shanghai': 'China',
    'Imola': 'Italy',
    'Miami': 'United States',
    'Barcelona': 'Spain',
    'Montreal': 'Canada',
    'Spielberg': 'Austria',
    'Silverstone': 'Great Britain',
    'Budapest': 'Hungary',
    'Spa-Francorchamps': 'Belgium',
    'Zandvoort': 'Netherlands',
    'Monza': 'Italy',
    'Baku': 'Azerbaijan',
    'Marina Bay': 'Singapore',
    'Austin': 'United States',
    'Mexico City': 'Mexico',
    'São Paulo': 'Brazil',
    'Losail': 'Qatar',
    'Yas Marina': 'United Arab Emirates',
    'Abu Dhabi': 'United Arab Emirates',
    'Las Vegas': 'United States',
  }
  
  return locationToCountry[location] || location
}

export default CountryFlag