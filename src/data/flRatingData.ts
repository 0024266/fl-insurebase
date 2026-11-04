export interface BCEGSRating {
  personal: string;
  commercial: string;
  year: number;
}

export interface MunicipalityRating {
  ProtectionClass: string;
  WindZone?: number;
  BCEGS?: BCEGSRating;
}

export interface CountyRatingData {
  County: string;
  CSPCode: string;
  WindZone: number;
  CountyProtectionClass: string;
  BCEGS: BCEGSRating;
  Municipalities?: Record<string, MunicipalityRating>;
}

export interface ResolvedRatings {
  csp: string | null;
  ppc: string;
  windZone: number | null;
  bcegs: BCEGSRating | null;
}

export const FL_RATING_DATA: CountyRatingData[] = [
  {
    County: 'ALACHUA',
    CSPCode: '010',
    WindZone: 4,
    CountyProtectionClass: '3/10',
    BCEGS: { personal: '04', commercial: '03', year: 2014 },
    Municipalities: {
      GAINESVILLE: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2005 } },
      ALACHUA: { ProtectionClass: '3/10', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      'HIGH SPRINGS': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      NEWBERRY: { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2018 } },
      ARCHER: { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      HAWTHORNE: { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      WALDO: { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '04', year: 2021 } },
      LACROSSE: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      MICANOPY: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '03', year: 2014 } }
    }
  },
  {
    County: 'BAKER',
    CSPCode: '020',
    WindZone: 4,
    CountyProtectionClass: '5/5Y',
    BCEGS: { personal: '05', commercial: '04', year: 2020 },
    Municipalities: {
      MACCLENNY: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '03', year: 2026 } },
      'GLEN ST MARY': { ProtectionClass: '5/5Y', BCEGS: { personal: '05', commercial: '04', year: 2020 } }
    }
  },
  {
    County: 'BAY',
    CSPCode: '030,035',
    WindZone: 3,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '04', commercial: '03', year: 2022 },
    Municipalities: {
      'PANAMA CITY': { ProtectionClass: '2/2X', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      'PANAMA CITY BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      'LYNN HAVEN': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      CALLAWAY: { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      SPRINGFIELD: { ProtectionClass: '3', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      PARKER: { ProtectionClass: '4', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      'MEXICO BEACH': { ProtectionClass: '4/4X', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2025 } }
    }
  },
  {
    County: 'BRADFORD',
    CSPCode: '040',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2024 },
    Municipalities: {
      STARKE: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2012 } },
      BROOKER: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      HAMPTON: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      LAWTEY: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2024 } }
    }
  },
  {
    County: 'BREVARD',
    CSPCode: '050,055',
    WindZone: 3,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '04', commercial: '04', year: 2024 },
    Municipalities: {
      MELBOURNE: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 1995 } },
      'PALM BAY': { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      TITUSVILLE: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      ROCKLEDGE: { ProtectionClass: '3', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      COCOA: { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2019 } },
      'COCOA BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2026 } },
      'CAPE CANAVERAL': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2023 } },
      'SATELLITE BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'INDIAN HARBOUR BEACH': { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2015 } },
      INDIALANTIC: { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2016 } },
      'MELBOURNE BEACH': { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '98', commercial: '98', year: 2023 } },
      'WEST MELBOURNE': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2021 } },
      MALABAR: { ProtectionClass: '4/10', BCEGS: { personal: '04', commercial: '04', year: 2018 } }
    }
  },
  {
    County: 'BROWARD',
    CSPCode: '060,061',
    WindZone: 1,
    CountyProtectionClass: '2/2X',
    BCEGS: { personal: '03', commercial: '03', year: 2007 },
    Municipalities: {
      'FORT LAUDERDALE': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      HOLLYWOOD: { ProtectionClass: '1', BCEGS: { personal: '05', commercial: '04', year: 2023 } },
      'POMPANO BEACH': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'CORAL SPRINGS': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 1996 } },
      'PEMBROKE PINES': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '02', year: 2017 } },
      SUNRISE: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      PLANTATION: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      DAVIE: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      'DEERFIELD BEACH': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      MIRAMAR: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      TAMARAC: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2021 } },
      MARGATE: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      'COCONUT CREEK': { ProtectionClass: '1', BCEGS: { personal: '05', commercial: '04', year: 2022 } },
      'HALLANDALE BEACH': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      'OAKLAND PARK': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2016 } },
      'NORTH LAUDERDALE': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 2013 } },
      LAUDERHILL: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'LAUDERDALE LAKES': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'DANIA BEACH': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'COOPER CITY': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      PARKLAND: { ProtectionClass: '2/2Y', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      WESTON: { ProtectionClass: '1/1X', BCEGS: { personal: '02', commercial: '02', year: 2016 } },
      'WILTON MANORS': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'LIGHTHOUSE POINT': { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '03', year: 2014 } },
      'SOUTHWEST RANCHES': { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2023 } }
    }
  },
  {
    County: 'CHARLOTTE',
    CSPCode: '080,085',
    WindZone: 3,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '03', year: 2020 },
    Municipalities: {
      'PUNTA GORDA': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2010 } },
      ENGLEWOOD: { ProtectionClass: '3/3X', WindZone: 2 },
      'PORT CHARLOTTE': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2020 } },
      'BOCA GRANDE': { ProtectionClass: '2/2X', WindZone: 2 }
    }
  },
  {
    County: 'CITRUS',
    CSPCode: '090,095',
    WindZone: 3,
    CountyProtectionClass: '3/3Y',
    BCEGS: { personal: '03', commercial: '03', year: 2025 },
    Municipalities: {
      INVERNESS: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '03', year: 2020 } },
      'CRYSTAL RIVER': { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'CLAY',
    CSPCode: '100',
    WindZone: 4,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '03', year: 2025 },
    Municipalities: {
      'ORANGE PARK': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      'GREEN COVE SPRINGS': { ProtectionClass: '4/4X', BCEGS: { personal: '05', commercial: '04', year: 2023 } },
      'KEYSTONE HEIGHTS': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      'PENNEY FARMS': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'COLLIER',
    CSPCode: '110',
    WindZone: 2,
    CountyProtectionClass: '3/10',
    BCEGS: { personal: '04', commercial: '03', year: 2014 },
    Municipalities: {
      NAPLES: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 1995 } },
      'MARCO ISLAND': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2026 } },
      IMMOKALEE: { ProtectionClass: '5/5X' },
      'EVERGLADES CITY': { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '03', year: 2020 } }
    }
  },
  {
    County: 'COLUMBIA',
    CSPCode: '120',
    WindZone: 4,
    CountyProtectionClass: '4/4Y',
    BCEGS: { personal: '04', commercial: '04', year: 2024 },
    Municipalities: {
      'LAKE CITY': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '04', year: 2024 } },
      'FORT WHITE': { ProtectionClass: '4/4Y', BCEGS: { personal: '04', commercial: '04', year: 2024 } }
    }
  },
  {
    County: 'DESOTO',
    CSPCode: '140',
    WindZone: 3,
    CountyProtectionClass: '4/10',
    BCEGS: { personal: '04', commercial: '03', year: 2020 },
    Municipalities: {
      ARCADIA: { ProtectionClass: '4/10', BCEGS: { personal: '04', commercial: '03', year: 2024 } }
    }
  },
  {
    County: 'DIXIE',
    CSPCode: '150,155',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2023 },
    Municipalities: {
      'CROSS CITY': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'HORSESHOE BEACH': { ProtectionClass: '5/5X', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2023 } }
    }
  },
  {
    County: 'DUVAL',
    CSPCode: '160,161,162,165',
    WindZone: 4,
    CountyProtectionClass: '1/10',
    BCEGS: { personal: '04', commercial: '03', year: 2008 },
    Municipalities: {
      JACKSONVILLE: { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '03', year: 2008 } },
      'JACKSONVILLE BEACH': { ProtectionClass: '1/10', WindZone: 2, BCEGS: { personal: '04', commercial: '04', year: 2013 } },
      'ATLANTIC BEACH': { ProtectionClass: '1/10', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2015 } },
      'NEPTUNE BEACH': { ProtectionClass: '1/10', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      BALDWIN: { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '04', year: 2020 } }
    }
  },
  {
    County: 'ESCAMBIA',
    CSPCode: '170,175',
    WindZone: 3,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '04', year: 2022 },
    Municipalities: {
      PENSACOLA: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '02', year: 2023 } },
      CENTURY: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2022 } }
    }
  },
  {
    County: 'FLAGLER',
    CSPCode: '180,185',
    WindZone: 3,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '03', commercial: '03', year: 2024 },
    Municipalities: {
      'PALM COAST': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2020 } },
      'FLAGLER BEACH': { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '04', commercial: '04', year: 2024 } },
      BUNNELL: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '04', year: 2021 } },
      'BEVERLY BEACH': { ProtectionClass: '3/3X', WindZone: 2, BCEGS: { personal: '04', commercial: '04', year: 2024 } },
      MARINELAND: { ProtectionClass: '3/3X', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2021 } }
    }
  },
  {
    County: 'FRANKLIN',
    CSPCode: '190',
    WindZone: 2,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '04', year: 2025 },
    Municipalities: {
      APALACHICOLA: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2013 } },
      CARRABELLE: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '04', year: 2016 } },
      EASTPOINT: { ProtectionClass: '5/5X' },
      'ST GEORGE ISLAND': { ProtectionClass: '4/4X' },
      'ALLIGATOR POINT': { ProtectionClass: '6/6X' }
    }
  },
  {
    County: 'GADSDEN',
    CSPCode: '200',
    WindZone: 4,
    CountyProtectionClass: '6/6X',
    BCEGS: { personal: '04', commercial: '04', year: 2023 },
    Municipalities: {
      QUINCY: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      HAVANA: { ProtectionClass: '6', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      MIDWAY: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      CHATTAHOOCHEE: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      GREENSBORO: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      GRETNA: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '04', year: 2023 } }
    }
  },
  {
    County: 'GILCHRIST',
    CSPCode: '210',
    WindZone: 4,
    CountyProtectionClass: '5/5Y',
    BCEGS: { personal: '04', commercial: '03', year: 2022 },
    Municipalities: {
      TRENTON: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      BELL: { ProtectionClass: '5/5Y', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'FANNING SPRINGS': { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'GLADES',
    CSPCode: '220',
    WindZone: 2,
    CountyProtectionClass: '6/6X',
    BCEGS: { personal: '03', commercial: '03', year: 2026 },
    Municipalities: {
      'MOORE HAVEN': { ProtectionClass: '6/6X', BCEGS: { personal: '03', commercial: '03', year: 2026 } }
    }
  },
  {
    County: 'GULF',
    CSPCode: '230,235',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2013 },
    Municipalities: {
      'PORT ST JOE': { ProtectionClass: '5/5X', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      WEWAHITCHKA: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2013 } }
    }
  },
  {
    County: 'HAMILTON',
    CSPCode: '240',
    WindZone: 4,
    CountyProtectionClass: '9/10',
    BCEGS: { personal: '04', commercial: '03', year: 2018 },
    Municipalities: {
      JASPER: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2018 } },
      'WHITE SPRINGS': { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2018 } },
      JENNINGS: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '03', year: 2018 } }
    }
  },
  {
    County: 'HARDEE',
    CSPCode: '250',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '03', commercial: '03', year: 2022 },
    Municipalities: {
      WAUCHULA: { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      'BOWLING GREEN': { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      'ZOLFO SPRINGS': { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2022 } }
    }
  },
  {
    County: 'HENDRY',
    CSPCode: '260',
    WindZone: 2,
    CountyProtectionClass: '6/6X',
    BCEGS: { personal: '04', commercial: '03', year: 2025 },
    Municipalities: {
      CLEWISTON: { ProtectionClass: '6/6Y', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      LABELLE: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '03', year: 2016 } }
    }
  },
  {
    County: 'HERNANDO',
    CSPCode: '270,275',
    WindZone: 3,
    CountyProtectionClass: '2/2Y',
    BCEGS: { personal: '04', commercial: '03', year: 2025 },
    Municipalities: {
      BROOKSVILLE: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '04', year: 2009 } },
      'SPRING HILL': { ProtectionClass: '2/2Y' }
    }
  },
  {
    County: 'HIGHLANDS',
    CSPCode: '280',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2026 },
    Municipalities: {
      SEBRING: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '04', year: 2010 } },
      'AVON PARK': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2026 } },
      'LAKE PLACID': { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2026 } }
    }
  },
  {
    County: 'HILLSBOROUGH',
    CSPCode: '290,291',
    WindZone: 3,
    CountyProtectionClass: '3/10',
    BCEGS: { personal: '04', commercial: '03', year: 2018 },
    Municipalities: {
      TAMPA: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'PLANT CITY': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'TEMPLE TERRACE': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2024 } }
    }
  },
  {
    County: 'HOLMES',
    CSPCode: '300',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '03', commercial: '02', year: 2026 },
    Municipalities: {
      BONIFAY: { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      ESTO: { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      'PONCE DE LEON': { ProtectionClass: '6/6X', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      WESTVILLE: { ProtectionClass: '10', BCEGS: { personal: '03', commercial: '02', year: 2026 } }
    }
  },
  {
    County: 'INDIAN RIVER',
    CSPCode: '310,315',
    WindZone: 2,
    CountyProtectionClass: '2/2X',
    BCEGS: { personal: '03', commercial: '03', year: 2022 },
    Municipalities: {
      'VERO BEACH': { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      SEBASTIAN: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      'INDIAN RIVER SHORES': { ProtectionClass: '3', WindZone: 1, BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      FELLSMERE: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2019 } },
      ORCHID: { ProtectionClass: '2/2X', WindZone: 1, BCEGS: { personal: '04', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'JACKSON',
    CSPCode: '320',
    WindZone: 4,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '04', year: 2007 },
    Municipalities: {
      MARIANNA: { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      GRACEVILLE: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2007 } },
      SNEADS: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '04', year: 2007 } },
      COTTONDALE: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      ALFORD: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      MALONE: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2007 } },
      'GRAND RIDGE': { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2025 } }
    }
  },
  {
    County: 'JEFFERSON',
    CSPCode: '330,335',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2025 },
    Municipalities: {
      MONTICELLO: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'LAFAYETTE',
    CSPCode: '340',
    WindZone: 4,
    CountyProtectionClass: '7/7X',
    BCEGS: { personal: '04', commercial: '03', year: 2024 },
    Municipalities: {
      MAYO: { ProtectionClass: '7/7X', BCEGS: { personal: '04', commercial: '03', year: 2024 } }
    }
  },
  {
    County: 'LAKE',
    CSPCode: '350',
    WindZone: 4,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '03', commercial: '02', year: 2017 },
    Municipalities: {
      LEESBURG: { ProtectionClass: '2/2X', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      CLERMONT: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      EUSTIS: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      TAVARES: { ProtectionClass: '3/3X', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      'MOUNT DORA': { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '02', year: 2020 } },
      'LADY LAKE': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2018 } },
      GROVELAND: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      MINNEOLA: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      UMATILLA: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'FRUITLAND PARK': { ProtectionClass: '3/3X', BCEGS: { personal: '05', commercial: '05', year: 2023 } },
      'THE VILLAGES': { ProtectionClass: '2/2Y' }
    }
  },
  {
    County: 'LEE',
    CSPCode: '360,365',
    WindZone: 3,
    CountyProtectionClass: '2/2X',
    BCEGS: { personal: '04', commercial: '03', year: 2018 },
    Municipalities: {
      'FORT MYERS': { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      'CAPE CORAL': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      'BONITA SPRINGS': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '04', year: 2010 } },
      ESTERO: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      'FORT MYERS BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '04', commercial: '04', year: 2019 } },
      SANIBEL: { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2019 } },
      'LEHIGH ACRES': { ProtectionClass: '3/10' },
      'NORTH FORT MYERS': { ProtectionClass: '3/3Y' },
      CAPTIVA: { ProtectionClass: '3', WindZone: 2 }
    }
  },
  {
    County: 'LEON',
    CSPCode: '370',
    WindZone: 4,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '03', commercial: '03', year: 2025 },
    Municipalities: {
      TALLAHASSEE: { ProtectionClass: '3/3X', BCEGS: { personal: '02', commercial: '02', year: 2026 } }
    }
  },
  {
    County: 'LEVY',
    CSPCode: '380,385',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '98', commercial: '98', year: 2025 },
    Municipalities: {
      CHIEFLAND: { ProtectionClass: '3/3X', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      WILLISTON: { ProtectionClass: '4/4Y', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      BRONSON: { ProtectionClass: '6/6X', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      'CEDAR KEY': { ProtectionClass: '4/4X', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      INGLIS: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '04', year: 2025 } },
      YANKEETOWN: { ProtectionClass: '5/5X', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2025 } }
    }
  },
  {
    County: 'LIBERTY',
    CSPCode: '390',
    WindZone: 4,
    CountyProtectionClass: '6/6X',
    BCEGS: { personal: '04', commercial: '03', year: 2016 },
    Municipalities: {
      BRISTOL: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '04', year: 2022 } }
    }
  },
  {
    County: 'MADISON',
    CSPCode: '400',
    WindZone: 4,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '03', commercial: '02', year: 2026 },
    Municipalities: {
      MADISON: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      GREENVILLE: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      LEE: { ProtectionClass: '10', BCEGS: { personal: '03', commercial: '02', year: 2026 } }
    }
  },
  {
    County: 'MANATEE',
    CSPCode: '410,415',
    WindZone: 3,
    CountyProtectionClass: '2/2X',
    BCEGS: { personal: '04', commercial: '03', year: 2010 },
    Municipalities: {
      BRADENTON: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '04', year: 2017 } },
      PALMETTO: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2013 } },
      'LONGBOAT KEY': { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2000 } },
      'ANNA MARIA': { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2009 } },
      'HOLMES BEACH': { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2015 } },
      'BRADENTON BEACH': { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'MARION',
    CSPCode: '420',
    WindZone: 4,
    CountyProtectionClass: '2/2Y',
    BCEGS: { personal: '04', commercial: '03', year: 2007 },
    Municipalities: {
      OCALA: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      BELLEVIEW: { ProtectionClass: '2/2Y', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      DUNNELLON: { ProtectionClass: '2/2Y', BCEGS: { personal: '04', commercial: '03', year: 2024 } }
    }
  },
  {
    County: 'MARTIN',
    CSPCode: '430',
    WindZone: 1,
    CountyProtectionClass: '2/10',
    BCEGS: { personal: '03', commercial: '03', year: 2026 },
    Municipalities: {
      STUART: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2024 } },
      'JUPITER ISLAND': { ProtectionClass: '4/10', BCEGS: { personal: '03', commercial: '03', year: 2004 } },
      'SEWALLS POINT': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 2017 } },
      INDIANTOWN: { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '02', year: 2026 } },
      'OCEAN BREEZE': { ProtectionClass: '2/10', BCEGS: { personal: '98', commercial: '98', year: 1997 } }
    }
  },
  {
    County: 'MIAMI-DADE',
    CSPCode: '130,131,132,133',
    WindZone: 1,
    CountyProtectionClass: '1/1X',
    BCEGS: { personal: '03', commercial: '02', year: 2017 },
    Municipalities: {
      MIAMI: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      'MIAMI BEACH': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      HIALEAH: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 1997 } },
      'CORAL GABLES': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      'NORTH MIAMI': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      'NORTH MIAMI BEACH': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      AVENTURA: { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      HOMESTEAD: { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2025 } },
      DORAL: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      'MIAMI GARDENS': { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'MIAMI LAKES': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'CUTLER BAY': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      'PALMETTO BAY': { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      PINECREST: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      'SOUTH MIAMI': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      'SUNNY ISLES BEACH': { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2000 } },
      'KEY BISCAYNE': { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '03', year: 2023 } },
      SWEETWATER: { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'HIALEAH GARDENS': { ProtectionClass: '1/1X', BCEGS: { personal: '98', commercial: '98', year: 2002 } },
      'OPA-LOCKA': { ProtectionClass: '1/1X', BCEGS: { personal: '98', commercial: '98', year: 2022 } },
      SURFSIDE: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '02', year: 2023 } }
    }
  },
  {
    County: 'MONROE',
    CSPCode: '440,445',
    WindZone: 5,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '04', commercial: '03', year: 2023 },
    Municipalities: {
      'KEY WEST': { ProtectionClass: '1/1X', WindZone: 6, BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      MARATHON: { ProtectionClass: '4/4X', WindZone: 6, BCEGS: { personal: '05', commercial: '03', year: 2023 } },
      'KEY COLONY BEACH': { ProtectionClass: '4/4X', WindZone: 5, BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      ISLAMORADA: { ProtectionClass: '2', WindZone: 5, BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'KEY LARGO': { ProtectionClass: '4/4X', WindZone: 6 },
      'OCEAN REEF': { ProtectionClass: '3/3X', WindZone: 6 }
    }
  },
  {
    County: 'NASSAU',
    CSPCode: '450,455',
    WindZone: 4,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '04', commercial: '03', year: 2021 },
    Municipalities: {
      'FERNANDINA BEACH': { ProtectionClass: '3/3X', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2019 } },
      CALLAHAN: { ProtectionClass: '5/5X', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      HILLIARD: { ProtectionClass: '6/6X', BCEGS: { personal: '04', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'OKALOOSA',
    CSPCode: '460,465',
    WindZone: 3,
    CountyProtectionClass: '3',
    BCEGS: { personal: '04', commercial: '03', year: 2024 },
    Municipalities: {
      'FORT WALTON BEACH': { ProtectionClass: '3', BCEGS: { personal: '03', commercial: '03', year: 2015 } },
      CRESTVIEW: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      NICEVILLE: { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2015 } },
      DESTIN: { ProtectionClass: '3', WindZone: 2, BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      VALPARAISO: { ProtectionClass: '2', BCEGS: { personal: '05', commercial: '04', year: 2023 } },
      'MARY ESTHER': { ProtectionClass: '3', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      'OKALOOSA ISLAND': { ProtectionClass: '2', WindZone: 2 }
    }
  },
  {
    County: 'OKEECHOBEE',
    CSPCode: '470',
    WindZone: 2,
    CountyProtectionClass: '3/3Y',
    BCEGS: { personal: '04', commercial: '04', year: 2022 },
    Municipalities: {
      OKEECHOBEE: { ProtectionClass: '3/3Y', BCEGS: { personal: '04', commercial: '04', year: 1996 } }
    }
  },
  {
    County: 'ORANGE',
    CSPCode: '481,485,486',
    WindZone: 4,
    CountyProtectionClass: '1/10',
    BCEGS: { personal: '03', commercial: '03', year: 2020 },
    Municipalities: {
      ORLANDO: { ProtectionClass: '1', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      'WINTER PARK': { ProtectionClass: '1', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      APOPKA: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '03', year: 2026 } },
      OCOEE: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '04', year: 2024 } },
      'WINTER GARDEN': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2018 } },
      MAITLAND: { ProtectionClass: '1', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      WINDERMERE: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'OSCEOLA',
    CSPCode: '490',
    WindZone: 4,
    CountyProtectionClass: '3/10',
    BCEGS: { personal: '04', commercial: '03', year: 2018 },
    Municipalities: {
      KISSIMMEE: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2015 } },
      'SAINT CLOUD': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2018 } },
      CELEBRATION: { ProtectionClass: '3/10' },
      POINCIANA: { ProtectionClass: '3/10' }
    }
  },
  {
    County: 'PALM BEACH',
    CSPCode: '500,501',
    WindZone: 1,
    CountyProtectionClass: '1/10',
    BCEGS: { personal: '04', commercial: '04', year: 2022 },
    Municipalities: {
      'WEST PALM BEACH': { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '02', year: 2017 } },
      'BOCA RATON': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2017 } },
      'BOYNTON BEACH': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '04', year: 2021 } },
      'DELRAY BEACH': { ProtectionClass: '1', BCEGS: { personal: '05', commercial: '04', year: 2022 } },
      'PALM BEACH GARDENS': { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      JUPITER: { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      WELLINGTON: { ProtectionClass: '1/10', BCEGS: { personal: '03', commercial: '02', year: 2012 } },
      'ROYAL PALM BEACH': { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      GREENACRES: { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'LAKE WORTH BEACH': { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'RIVIERA BEACH': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2016 } },
      'NORTH PALM BEACH': { ProtectionClass: '2/2Y', BCEGS: { personal: '04', commercial: '03', year: 2023 } },
      'PALM BEACH': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      TEQUESTA: { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'BELLE GLADE': { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '03', year: 2021 } },
      'HIGHLAND BEACH': { ProtectionClass: '3', BCEGS: { personal: '03', commercial: '03', year: 2017 } },
      'SOUTH BAY': { ProtectionClass: '1/10', BCEGS: { personal: '03', commercial: '03', year: 2007 } },
      PAHOKEE: { ProtectionClass: '1/10', BCEGS: { personal: '04', commercial: '03', year: 2022 } }
    }
  },
  {
    County: 'PASCO',
    CSPCode: '510,515',
    WindZone: 3,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '03', commercial: '03', year: 2024 },
    Municipalities: {
      'NEW PORT RICHEY': { ProtectionClass: '3/3X', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      'DADE CITY': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      ZEPHYRHILLS: { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '04', year: 2023 } },
      'PORT RICHEY': { ProtectionClass: '4', BCEGS: { personal: '02', commercial: '02', year: 2026 } },
      ARIPEKA: { ProtectionClass: '3/3X', WindZone: 2 }
    }
  },
  {
    County: 'PINELLAS',
    CSPCode: '520,521,522,525',
    WindZone: 3,
    CountyProtectionClass: '2',
    BCEGS: { personal: '03', commercial: '03', year: 2018 },
    Municipalities: {
      'SAINT PETERSBURG': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      CLEARWATER: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      LARGO: { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '03', year: 2013 } },
      'PINELLAS PARK': { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      DUNEDIN: { ProtectionClass: '2', BCEGS: { personal: '04', commercial: '03', year: 2007 } },
      'PALM HARBOR': { ProtectionClass: '2' },
      'TARPON SPRINGS': { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      SEMINOLE: { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '04', year: 2022 } },
      'SAFETY HARBOR': { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'ST PETE BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2013 } },
      'TREASURE ISLAND': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2009 } },
      'INDIAN ROCKS BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      'MADEIRA BEACH': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2013 } }
    }
  },
  {
    County: 'POLK',
    CSPCode: '530',
    WindZone: 4,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '04', commercial: '03', year: 2007 },
    Municipalities: {
      LAKELAND: { ProtectionClass: '1/1X', BCEGS: { personal: '04', commercial: '04', year: 1995 } },
      'WINTER HAVEN': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2018 } },
      BARTOW: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2016 } },
      'HAINES CITY': { ProtectionClass: '4/4X', BCEGS: { personal: '05', commercial: '04', year: 2022 } },
      AUBURNDALE: { ProtectionClass: '3/10', BCEGS: { personal: '04', commercial: '04', year: 2008 } },
      'LAKE WALES': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      DAVENPORT: { ProtectionClass: '2/2X', BCEGS: { personal: '05', commercial: '04', year: 2024 } },
      FROSTPROOF: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2012 } },
      'FORT MEADE': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2014 } },
      'LAKE ALFRED': { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2019 } }
    }
  },
  {
    County: 'PUTNAM',
    CSPCode: '540',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '03', commercial: '03', year: 2024 },
    Municipalities: {
      PALATKA: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'CRESCENT CITY': { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      INTERLACHEN: { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2022 } },
      'POMONA PARK': { ProtectionClass: '5/5X', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      WELAKA: { ProtectionClass: '5/10', BCEGS: { personal: '04', commercial: '04', year: 2023 } }
    }
  },
  {
    County: 'SANTA ROSA',
    CSPCode: '570,575',
    WindZone: 3,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '03', commercial: '02', year: 2025 },
    Municipalities: {
      MILTON: { ProtectionClass: '4/4X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      'GULF BREEZE': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      JAY: { ProtectionClass: '5', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      'NAVARRE BEACH': { ProtectionClass: '3/3X', WindZone: 2 },
      PACE: { ProtectionClass: '3/3X' }
    }
  },
  {
    County: 'SARASOTA',
    CSPCode: '580,585',
    WindZone: 3,
    CountyProtectionClass: '2/2Y',
    BCEGS: { personal: '04', commercial: '04', year: 2022 },
    Municipalities: {
      SARASOTA: { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '01', year: 2001 } },
      'NORTH PORT': { ProtectionClass: '1/1Y', BCEGS: { personal: '03', commercial: '03', year: 2018 } },
      VENICE: { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '04', commercial: '03', year: 2011 } },
      'LONGBOAT KEY': { ProtectionClass: '2/2X', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2000 } },
      NOKOMIS: { ProtectionClass: '2/2Y', WindZone: 2 }
    }
  },
  {
    County: 'SEMINOLE',
    CSPCode: '590',
    WindZone: 4,
    CountyProtectionClass: '1/10',
    BCEGS: { personal: '03', commercial: '03', year: 2025 },
    Municipalities: {
      SANFORD: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '02', year: 2018 } },
      'ALTAMONTE SPRINGS': { ProtectionClass: '1/10', BCEGS: { personal: '02', commercial: '02', year: 2023 } },
      CASSELBERRY: { ProtectionClass: '1/10', BCEGS: { personal: '98', commercial: '98', year: 2025 } },
      'LAKE MARY': { ProtectionClass: '1', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      LONGWOOD: { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      OVIEDO: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      'WINTER SPRINGS': { ProtectionClass: '1/10', BCEGS: { personal: '03', commercial: '02', year: 2026 } }
    }
  },
  {
    County: 'ST. JOHNS',
    CSPCode: '550,555',
    WindZone: 3,
    CountyProtectionClass: '3/3X',
    BCEGS: { personal: '03', commercial: '02', year: 2025 },
    Municipalities: {
      'SAINT AUGUSTINE': { ProtectionClass: '1', BCEGS: { personal: '04', commercial: '03', year: 2021 } },
      'SAINT AUGUSTINE BEACH': { ProtectionClass: '3/3X', WindZone: 2, BCEGS: { personal: '03', commercial: '02', year: 2024 } }
    }
  },
  {
    County: 'ST. LUCIE',
    CSPCode: '560,565',
    WindZone: 2,
    CountyProtectionClass: '2/10',
    BCEGS: { personal: '03', commercial: '03', year: 2024 },
    Municipalities: {
      'FORT PIERCE': { ProtectionClass: '2/10', BCEGS: { personal: '04', commercial: '04', year: 2021 } },
      'PORT SAINT LUCIE': { ProtectionClass: '2/10', BCEGS: { personal: '03', commercial: '02', year: 2015 } }
    }
  },
  {
    County: 'SUMTER',
    CSPCode: '600',
    WindZone: 4,
    CountyProtectionClass: '3/3Y',
    BCEGS: { personal: '04', commercial: '03', year: 2022 },
    Municipalities: {
      BUSHNELL: { ProtectionClass: '3/3Y', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      WILDWOOD: { ProtectionClass: '3/3Y', BCEGS: { personal: '04', commercial: '03', year: 2022 } },
      'THE VILLAGES': { ProtectionClass: '2/2Y' }
    }
  },
  {
    County: 'SUWANNEE',
    CSPCode: '610',
    WindZone: 4,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '05', commercial: '04', year: 2023 },
    Municipalities: {
      'LIVE OAK': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      BRANFORD: { ProtectionClass: '5/5X', BCEGS: { personal: '05', commercial: '04', year: 2023 } }
    }
  },
  {
    County: 'TAYLOR',
    CSPCode: '620,625',
    WindZone: 3,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '04', year: 2025 },
    Municipalities: {
      PERRY: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '04', year: 2025 } }
    }
  },
  {
    County: 'UNION',
    CSPCode: '630',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '03', year: 2025 },
    Municipalities: {
      'LAKE BUTLER': { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2025 } }
    }
  },
  {
    County: 'VOLUSIA',
    CSPCode: '640,645',
    WindZone: 3,
    CountyProtectionClass: '3/3Y',
    BCEGS: { personal: '04', commercial: '03', year: 2005 },
    Municipalities: {
      'DAYTONA BEACH': { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2008 } },
      DELAND: { ProtectionClass: '1/1X', BCEGS: { personal: '03', commercial: '02', year: 2025 } },
      DELTONA: { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      'ORMOND BEACH': { ProtectionClass: '3/3X', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      'PORT ORANGE': { ProtectionClass: '3/3X', BCEGS: { personal: '04', commercial: '03', year: 2004 } },
      'NEW SMYRNA BEACH': { ProtectionClass: '2/2X', BCEGS: { personal: '03', commercial: '03', year: 2025 } },
      EDGEWATER: { ProtectionClass: '2/2X', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      DEBARY: { ProtectionClass: '2/2Y', BCEGS: { personal: '04', commercial: '03', year: 2021 } },
      'HOLLY HILL': { ProtectionClass: '4', BCEGS: { personal: '04', commercial: '03', year: 2024 } },
      'ORANGE CITY': { ProtectionClass: '2/2Y', BCEGS: { personal: '03', commercial: '03', year: 2021 } },
      'SOUTH DAYTONA': { ProtectionClass: '2', BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'PONCE INLET': { ProtectionClass: '2', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2024 } },
      'DAYTONA BEACH SHORES': { ProtectionClass: '4', WindZone: 2, BCEGS: { personal: '03', commercial: '03', year: 2023 } }
    }
  },
  {
    County: 'WAKULLA',
    CSPCode: '650,655',
    WindZone: 3,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '02', year: 2022 },
    Municipalities: {
      'SAINT MARKS': { ProtectionClass: '5/5X', WindZone: 2, BCEGS: { personal: '04', commercial: '02', year: 2022 } },
      SOPCHOPPY: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '02', year: 2022 } }
    }
  },
  {
    County: 'WALTON',
    CSPCode: '660,665',
    WindZone: 3,
    CountyProtectionClass: '4/4X',
    BCEGS: { personal: '04', commercial: '03', year: 2026 },
    Municipalities: {
      'DEFUNIAK SPRINGS': { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '03', year: 2026 } },
      FREEPORT: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2026 } },
      'SANTA ROSA BEACH': { ProtectionClass: '3/3X', WindZone: 2 },
      PAXTON: { ProtectionClass: '4/4X', BCEGS: { personal: '04', commercial: '03', year: 2026 } }
    }
  },
  {
    County: 'WASHINGTON',
    CSPCode: '670',
    WindZone: 4,
    CountyProtectionClass: '5/5X',
    BCEGS: { personal: '04', commercial: '04', year: 2018 },
    Municipalities: {
      CHIPLEY: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '04', year: 2018 } },
      VERNON: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '04', year: 2018 } },
      WAUSAU: { ProtectionClass: '5/5X', BCEGS: { personal: '04', commercial: '04', year: 2018 } },
      EBRO: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '04', year: 2018 } },
      CARYVILLE: { ProtectionClass: '10', BCEGS: { personal: '04', commercial: '04', year: 2018 } }
    }
  }
];

/**
 * Automated lookup resolution helper function:
 * Resolves ISO Public Protection Classification (PPC), Commercial Wind Zones (EC Zones),
 * Building Code Effectiveness Grading Schedule (BCEGS), and CSP Code.
 */
export function resolveRatings(countyName?: string | null, cityName?: string | null): ResolvedRatings {
  // Normalize county (strip common prefixes or standard formatting like 'ST. JOHNS' / 'ST JOHNS' / 'MIAMI-DADE' / 'MIAMI DADE')
  let rawCounty = (countyName || '').trim().toUpperCase();
  if (rawCounty.startsWith('COUNTY OF ')) rawCounty = rawCounty.replace('COUNTY OF ', '');
  if (rawCounty.endsWith(' COUNTY')) rawCounty = rawCounty.replace(' COUNTY', '');

  const normCity = (cityName || '').trim().toUpperCase();

  // Look up county data with flexible alias handling (e.g. ST. JOHNS vs ST JOHNS, SAINT vs ST)
  let countyData = FL_RATING_DATA.find((c) => c.County === rawCounty);
  if (!countyData) {
    const simplified = rawCounty.replace(/\./g, '').replace(/[-_]/g, ' ');
    countyData = FL_RATING_DATA.find((c) => {
      const cSimp = c.County.replace(/\./g, '').replace(/[-_]/g, ' ');
      return cSimp === simplified;
    });
  }

  if (!countyData) {
    return {
      csp: null,
      ppc: '10',
      windZone: null,
      bcegs: null
    };
  }

  // Look up municipality data (supporting aliases like ST. vs SAINT, FT vs FORT)
  let muni = countyData.Municipalities?.[normCity];
  if (!muni && countyData.Municipalities) {
    const normClean = normCity.replace(/\./g, '').replace(/[-_]/g, ' ');
    for (const [key, val] of Object.entries(countyData.Municipalities)) {
      const keyClean = key.replace(/\./g, '').replace(/[-_]/g, ' ');
      if (
        keyClean === normClean ||
        keyClean.replace('SAINT', 'ST') === normClean.replace('SAINT', 'ST') ||
        keyClean.replace('FORT', 'FT') === normClean.replace('FORT', 'FT')
      ) {
        muni = val;
        break;
      }
    }
  }

  return {
    csp: countyData.CSPCode,
    ppc: muni?.ProtectionClass || countyData.CountyProtectionClass || '10',
    windZone: muni?.WindZone !== undefined ? muni.WindZone : countyData.WindZone,
    bcegs: muni?.BCEGS || countyData.BCEGS
  };
}
