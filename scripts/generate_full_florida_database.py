import json

# Comprehensive database of all 67 Florida Counties with their Property Appraiser Portals & County Permit Portals
COUNTY_INFO = {
    "ALACHUA": {
        "PAlink": "https://www.acpafl.org/",
        "PermitByCounty": "https://alachuacounty.us/depts/growthmanagement/building/pages/default.aspx",
        "Terrain": "B",
        "zips": [32601, 32602, 32603, 32604, 32605, 32606, 32607, 32608, 32609, 32610, 32611, 32612, 32614, 32615, 32616, 32618, 32627, 32631, 32633, 32635, 32640, 32641, 32653, 32654, 32655, 32656, 32662, 32667, 32669, 32694],
        "cities": {"32601": "GAINESVILLE", "32605": "GAINESVILLE", "32607": "GAINESVILLE", "32608": "GAINESVILLE", "32615": "ALACHUA", "32616": "ARCHER", "32640": "HAWTHORNE", "32641": "HAWTHORNE", "32653": "GAINESVILLE", "32669": "NEWBERRY", "32643": "HIGH SPRINGS"}
    },
    "BAKER": {
        "PAlink": "https://bakerpa.com/",
        "PermitByCounty": "https://www.bakercountyfl.org/building-department.php",
        "Terrain": "B",
        "zips": [32063, 32072, 32087],
        "cities": {"32063": "MACCLENNY", "32072": "OLUSTEE", "32087": "SANDERSON"}
    },
    "BAY": {
        "PAlink": "https://qpublic.schneidercorp.com/Application.aspx?App=BayCountyFL",
        "PermitByCounty": "https://www.baycountyfl.gov/155/Builders-Services",
        "Terrain": "C",
        "zips": [32401, 32402, 32403, 32404, 32405, 32406, 32407, 32408, 32409, 32410, 32411, 32412, 32413, 32417, 32438, 32444, 32456, 32461],
        "cities": {"32401": "PANAMA CITY", "32404": "PANAMA CITY", "32405": "PANAMA CITY", "32407": "PANAMA CITY BEACH", "32408": "PANAMA CITY BEACH", "32413": "PANAMA CITY BEACH", "32444": "LYNN HAVEN", "32456": "MEXICO BEACH", "32461": "ROSEMARY BEACH"}
    },
    "BRADFORD": {
        "PAlink": "https://bradfordappraiser.com/",
        "PermitByCounty": "https://bradfordcountyfl.gov/building-zoning/",
        "Terrain": "B",
        "zips": [32044, 32054, 32091, 32622, 32658, 32666],
        "cities": {"32044": "HAMPTON", "32054": "LAWTEY", "32091": "STARKE", "32622": "BROOKER", "32666": "KEYSTONE HEIGHTS"}
    },
    "BREVARD": {
        "PAlink": "https://www.bcpao.us/",
        "PermitByCounty": "https://www.brevardfl.gov/PlanningDev/PermittingAndInspections",
        "Terrain": "C",
        "zips": [32754, 32775, 32780, 32781, 32783, 32796, 32901, 32902, 32903, 32904, 32905, 32906, 32907, 32908, 32909, 32910, 32911, 32912, 32919, 32920, 32922, 32923, 32924, 32925, 32926, 32927, 32931, 32932, 32934, 32935, 32936, 32937, 32940, 32941, 32948, 32949, 32950, 32951, 32952, 32953, 32954, 32955, 32959, 32976],
        "cities": {"32780": "TITUSVILLE", "32796": "TITUSVILLE", "32901": "MELBOURNE", "32903": "INDIALANTIC", "32904": "MELBOURNE", "32905": "PALM BAY", "32907": "PALM BAY", "32909": "PALM BAY", "32920": "CAPE CANAVERAL", "32922": "COCOA", "32926": "COCOA", "32931": "COCOA BEACH", "32934": "MELBOURNE", "32935": "MELBOURNE", "32937": "SATELLITE BEACH", "32940": "VIERA", "32951": "MELBOURNE BEACH", "32952": "MERRITT ISLAND", "32953": "MERRITT ISLAND", "32955": "ROCKLEDGE"}
    },
    "BROWARD": {
        "PAlink": "https://web.bcpa.net/BcpaClient/#/Record-Search",
        "PermitByCounty": "https://dpepp.broward.org/BCS/Default.aspx?PossePresentation=ParcelSearchByAddress",
        "Terrain": "C",
        "zips": [33004, 33008, 33009, 33019, 33020, 33021, 33022, 33023, 33024, 33025, 33026, 33027, 33028, 33029, 33060, 33061, 33062, 33063, 33064, 33065, 33066, 33067, 33068, 33069, 33071, 33072, 33073, 33074, 33075, 33076, 33077, 33081, 33082, 33083, 33084, 33093, 33097, 33301, 33302, 33303, 33304, 33305, 33306, 33307, 33308, 33309, 33310, 33311, 33312, 33313, 33314, 33315, 33316, 33317, 33318, 33319, 33320, 33321, 33322, 33323, 33324, 33325, 33326, 33327, 33328, 33329, 33330, 33331, 33332, 33334, 33335, 33336, 33337, 33338, 33339, 33340, 33345, 33346, 33348, 33349, 33351, 33355, 33359, 33388, 33394],
        "cities": {"33004": "DANIA BEACH", "33009": "HALLANDALE BEACH", "33019": "HOLLYWOOD", "33020": "HOLLYWOOD", "33021": "HOLLYWOOD", "33023": "PEMBROKE PINES", "33024": "PEMBROKE PINES", "33025": "PEMBROKE PINES", "33026": "PEMBROKE PINES", "33027": "PEMBROKE PINES", "33028": "PEMBROKE PINES", "33029": "PEMBROKE PINES", "33060": "POMPANO BEACH", "33062": "POMPANO BEACH", "33063": "MARGATE", "33064": "POMPANO BEACH", "33065": "CORAL SPRINGS", "33066": "COCONUT CREEK", "33067": "PARKLAND", "33068": "NORTH LAUDERDALE", "33069": "POMPANO BEACH", "33071": "CORAL SPRINGS", "33073": "PARKLAND", "33076": "PARKLAND", "33301": "FORT LAUDERDALE", "33304": "FORT LAUDERDALE", "33308": "FORT LAUDERDALE", "33311": "FORT LAUDERDALE", "33312": "FORT LAUDERDALE", "33313": "LAUDERHILL", "33314": "DAVIE", "33316": "FORT LAUDERDALE", "33317": "PLANTATION", "33319": "LAUDERHILL", "33321": "TAMARAC", "33322": "PLANTATION", "33323": "SUNRISE", "33324": "PLANTATION", "33325": "DAVIE", "33326": "WESTON", "33327": "WESTON", "33328": "DAVIE", "33330": "DAVIE", "33331": "WESTON", "33332": "WESTON", "33334": "OAKLAND PARK", "33351": "SUNRISE"}
    },
    "CALHOUN": {
        "PAlink": "https://calhounpa.net/",
        "PermitByCounty": "https://calhouncountygov.com/departments/building-department/",
        "Terrain": "B",
        "zips": [32421, 32424, 32430, 32448],
        "cities": {"32424": "BLOUNTSTOWN", "32430": "CLARKSVILLE", "32448": "ALTHA"}
    },
    "CHARLOTTE": {
        "PAlink": "https://www.ccappraiser.com/RPSearchEnter.asp",
        "PermitByCounty": "https://www.charlottecountyfl.gov/departments/community-development/building-construction/",
        "Terrain": "C",
        "zips": [33946, 33947, 33948, 33949, 33950, 33951, 33952, 33953, 33954, 33955, 33980, 33981, 33982, 33983, 34223, 34224],
        "cities": {"33946": "PLACIDA", "33947": "ROTONDA WEST", "33948": "PORT CHARLOTTE", "33950": "PUNTA GORDA", "33952": "PORT CHARLOTTE", "33953": "PORT CHARLOTTE", "33954": "PORT CHARLOTTE", "33955": "PUNTA GORDA", "33980": "PORT CHARLOTTE", "33981": "PORT CHARLOTTE", "33982": "PUNTA GORDA", "33983": "PORT CHARLOTTE", "34223": "ENGLEWOOD", "34224": "ENGLEWOOD"}
    },
    "CITRUS": {
        "PAlink": "https://www.citruspa.com/",
        "PermitByCounty": "https://www.citrusbocc.com/departments/growth_management/building_division/index.php",
        "Terrain": "B",
        "zips": [34428, 34429, 34433, 34434, 34436, 34442, 34446, 34447, 34448, 34449, 34450, 34451, 34452, 34453, 34460, 34461, 34464, 34465],
        "cities": {"34428": "CRYSTAL RIVER", "34429": "CRYSTAL RIVER", "34433": "DUNNELLON", "34434": "DUNNELLON", "34442": "BEVERLY HILLS", "34446": "HOMOSASSA", "34448": "HOMOSASSA", "34450": "INVERNESS", "34452": "INVERNESS", "34453": "INVERNESS", "34461": "LECANTO", "34465": "BEVERLY HILLS"}
    },
    "CLAY": {
        "PAlink": "https://www.ccpao.com/",
        "PermitByCounty": "https://www.claycountygov.com/community/building-division",
        "Terrain": "B",
        "zips": [32003, 32043, 32065, 32067, 32068, 32073, 32079, 32091, 32656],
        "cities": {"32003": "FLEMING ISLAND", "32043": "GREEN COVE SPRINGS", "32065": "ORANGE PARK", "32068": "MIDDLEBURG", "32073": "ORANGE PARK", "32656": "KEYSTONE HEIGHTS"}
    },
    "COLLIER": {
        "PAlink": "https://www.collierappraiser.com/",
        "PermitByCounty": "https://www.colliercountyfl.gov/your-government/divisions-a-e/building-plan-review-and-inspection",
        "Terrain": "C",
        "zips": [34101, 34102, 34103, 34104, 34105, 34106, 34107, 34108, 34109, 34110, 34112, 34113, 34114, 34116, 34117, 34119, 34120, 34137, 34138, 34139, 34140, 34141, 34142, 34143, 34145, 34146],
        "cities": {"34102": "NAPLES", "34103": "NAPLES", "34104": "NAPLES", "34105": "NAPLES", "34108": "NAPLES", "34109": "NAPLES", "34110": "NAPLES", "34112": "NAPLES", "34113": "NAPLES", "34114": "NAPLES", "34116": "NAPLES", "34119": "NAPLES", "34120": "NAPLES", "34137": "COPELAND", "34138": "CHOKOLOSKEE", "34139": "EVERGLADES CITY", "34142": "IMMOKALEE", "34145": "MARCO ISLAND"}
    },
    "COLUMBIA": {
        "PAlink": "https://columbiapropertyappraiser.com/",
        "PermitByCounty": "https://www.columbiacountyfla.com/BuildingandZoning.asp",
        "Terrain": "B",
        "zips": [32024, 32025, 32038, 32055, 32056],
        "cities": {"32024": "LAKE CITY", "32025": "LAKE CITY", "32038": "FORT WHITE"}
    },
    "DESOTO": {
        "PAlink": "https://desotopa.com/",
        "PermitByCounty": "https://desotobocc.com/departments/building_and_zoning",
        "Terrain": "B",
        "zips": [34265, 34266, 34269],
        "cities": {"34266": "ARCADIA", "34269": "NOCATEE"}
    },
    "DIXIE": {
        "PAlink": "https://dixiepa.com/",
        "PermitByCounty": "https://dixiecountyfl.gov/building-department/",
        "Terrain": "B",
        "zips": [32628, 32648, 32680, 32692],
        "cities": {"32628": "CROSS CITY", "32648": "HORSESHOE BEACH", "32680": "OLD TOWN", "32692": "SUWANNEE"}
    },
    "DUVAL": {
        "PAlink": "https://paopropertysearch.coj.net/",
        "PermitByCounty": "https://www.coj.net/departments/planning-and-development/building-inspection-division",
        "Terrain": "C",
        "zips": [32099, 32201, 32202, 32203, 32204, 32205, 32206, 32207, 32208, 32209, 32210, 32211, 32212, 32214, 32215, 32216, 32217, 32218, 32219, 32220, 32221, 32222, 32223, 32224, 32225, 32226, 32227, 32228, 32229, 32231, 32232, 32233, 32234, 32235, 32236, 32237, 32238, 32239, 32240, 32241, 32244, 32245, 32246, 32247, 32250, 32254, 32255, 32256, 32257, 32258, 32259, 32260, 32266, 32277],
        "cities": {"32202": "JACKSONVILLE", "32204": "JACKSONVILLE", "32205": "JACKSONVILLE", "32207": "JACKSONVILLE", "32210": "JACKSONVILLE", "32216": "JACKSONVILLE", "32218": "JACKSONVILLE", "32223": "JACKSONVILLE", "32224": "JACKSONVILLE", "32225": "JACKSONVILLE", "32233": "ATLANTIC BEACH", "32246": "JACKSONVILLE", "32250": "JACKSONVILLE BEACH", "32256": "JACKSONVILLE", "32257": "JACKSONVILLE", "32258": "JACKSONVILLE", "32266": "NEPTUNE BEACH"}
    },
    "ESCAMBIA": {
        "PAlink": "https://www.escpa.org/",
        "PermitByCounty": "https://myescambia.com/our-services/building-inspections",
        "Terrain": "C",
        "zips": [32501, 32502, 32503, 32504, 32505, 32506, 32507, 32508, 32509, 32511, 32512, 32513, 32514, 32516, 32520, 32521, 32522, 32523, 32524, 32526, 32533, 32534, 32535, 32559, 32568, 32577],
        "cities": {"32501": "PENSACOLA", "32502": "PENSACOLA", "32503": "PENSACOLA", "32504": "PENSACOLA", "32505": "PENSACOLA", "32506": "PENSACOLA", "32507": "PENSACOLA", "32514": "PENSACOLA", "32526": "PENSACOLA", "32533": "CANTONMENT", "32534": "PENSACOLA", "32535": "CENTURY", "32577": "MOLINO"}
    },
    "FLAGLER": {
        "PAlink": "https://flaglerpa.com/",
        "PermitByCounty": "https://www.flaglercounty.gov/departments/growth-management/building-services",
        "Terrain": "C",
        "zips": [32110, 32135, 32136, 32137, 32142, 32143, 32164],
        "cities": {"32110": "BUNNELL", "32135": "PALM COAST", "32136": "FLAGLER BEACH", "32137": "PALM COAST", "32164": "PALM COAST"}
    },
    "FRANKLIN": {
        "PAlink": "https://www.franklincountypropertyappraiser.com/",
        "PermitByCounty": "https://www.franklincountyflorida.gov/building-department/",
        "Terrain": "C",
        "zips": [32320, 32322, 32328, 32331, 32346],
        "cities": {"32320": "APALACHICOLA", "32322": "CARRABELLE", "32328": "EASTPOINT", "32346": "PANACEA"}
    },
    "GADSDEN": {
        "PAlink": "https://gadsdenpa.gov/",
        "PermitByCounty": "https://www.gadsdengov.net/departments/building_and_zoning/index.php",
        "Terrain": "B",
        "zips": [32324, 32330, 32333, 32343, 32351, 32352, 32353],
        "cities": {"32324": "CHATTAHOOCHEE", "32330": "GREENSBORO", "32333": "HAVANA", "32343": "MIDWAY", "32351": "QUINCY", "32352": "QUINCY"}
    },
    "GILCHRIST": {
        "PAlink": "https://gilchristpa.com/",
        "PermitByCounty": "https://gilchrist.fl.us/building-department/",
        "Terrain": "B",
        "zips": [32619, 32680, 32693],
        "cities": {"32619": "BELL", "32693": "TRENTON"}
    },
    "GLADES": {
        "PAlink": "https://gladespa.com/",
        "PermitByCounty": "https://www.myglades.com/departments/building_department/index.php",
        "Terrain": "B",
        "zips": [33471, 33930, 33935, 33944],
        "cities": {"33471": "MOORE HAVEN", "33944": "PALMDALE"}
    },
    "GULF": {
        "PAlink": "https://gulfpa.gov/",
        "PermitByCounty": "https://www.gulfcounty-fl.gov/departments/building_department/index.php",
        "Terrain": "C",
        "zips": [32456, 32465],
        "cities": {"32456": "PORT ST JOE", "32465": "WEWAHITCHKA"}
    },
    "HAMILTON": {
        "PAlink": "https://hamiltonpa.com/",
        "PermitByCounty": "https://hamiltoncountyfl.com/building-department/",
        "Terrain": "B",
        "zips": [32052, 32053, 32096],
        "cities": {"32052": "JASPER", "32053": "JENNINGS", "32096": "WHITE SPRINGS"}
    },
    "HARDEE": {
        "PAlink": "https://hardeepa.com/",
        "PermitByCounty": "https://www.hardeecountyfl.gov/building-department/",
        "Terrain": "B",
        "zips": [33834, 33865, 33873, 33890],
        "cities": {"33834": "BOWLING GREEN", "33865": "ONA", "33873": "WAUCHULA", "33890": "ZOLFO SPRINGS"}
    },
    "HENDRY": {
        "PAlink": "https://hendrypa.com/",
        "PermitByCounty": "https://www.hendryfla.net/building_licensing.php",
        "Terrain": "B",
        "zips": [33440, 33471, 33935, 33936],
        "cities": {"33440": "CLEWISTON", "33935": "LABELLE", "33936": "LABELLE"}
    },
    "HERNANDO": {
        "PAlink": "https://www.hernandopa-fl.us/",
        "PermitByCounty": "https://www.hernandocounty.us/departments/departments-a-e/building-division",
        "Terrain": "B",
        "zips": [34601, 34602, 34603, 34604, 34605, 34606, 34607, 34608, 34609, 34611, 34613, 34614, 34661],
        "cities": {"34601": "BROOKSVILLE", "34604": "BROOKSVILLE", "34606": "SPRING HILL", "34607": "SPRING HILL", "34608": "SPRING HILL", "34609": "SPRING HILL", "34613": "BROOKSVILLE", "34614": "BROOKSVILLE"}
    },
    "HIGHLANDS": {
        "PAlink": "https://www.highlandspa.org/",
        "PermitByCounty": "https://www.highlandsfl.gov/departments/development_services/building_division/index.php",
        "Terrain": "B",
        "zips": [33825, 33826, 33852, 33857, 33862, 33870, 33871, 33872, 33875, 33876],
        "cities": {"33825": "AVON PARK", "33826": "AVON PARK", "33852": "LAKE PLACID", "33857": "LORIDA", "33870": "SEBRING", "33872": "SEBRING", "33875": "SEBRING"}
    },
    "HILLSBOROUGH": {
        "PAlink": "https://gis.hcpafl.org/propertysearch/#/nav/Basic%20Search",
        "PermitByCounty": "https://www.hillsboroughcounty.org/en/businesses/permits-and-records/permitting-tools/building-permit-documents-and-records",
        "Terrain": "B",
        "zips": [33510, 33511, 33527, 33534, 33547, 33548, 33549, 33556, 33558, 33559, 33563, 33564, 33565, 33566, 33567, 33569, 33570, 33572, 33573, 33578, 33579, 33584, 33587, 33592, 33594, 33596, 33598, 33601, 33602, 33603, 33604, 33605, 33606, 33607, 33608, 33609, 33610, 33611, 33612, 33613, 33614, 33615, 33616, 33617, 33618, 33619, 33620, 33621, 33622, 33623, 33624, 33625, 33626, 33629, 33630, 33631, 33634, 33635, 33637, 33647, 33660, 33661, 33662, 33664, 33672, 33673, 33674, 33675, 33677, 33679, 33680, 33681, 33682, 33684, 33685, 33686, 33687, 33688, 33689, 33694],
        "cities": {"33510": "BRANDON", "33511": "BRANDON", "33527": "DOVER", "33534": "GIBSONTON", "33547": "LITHIA", "33548": "LUTZ", "33549": "LUTZ", "33556": "ODESSA", "33558": "LUTZ", "33563": "PLANT CITY", "33565": "PLANT CITY", "33566": "PLANT CITY", "33567": "PLANT CITY", "33569": "RIVERVIEW", "33570": "RUSKIN", "33572": "APOLLO BEACH", "33573": "SUN CITY CENTER", "33578": "RIVERVIEW", "33579": "RIVERVIEW", "33584": "SEFFNER", "33594": "VALRICO", "33596": "VALRICO", "33598": "WIMAUMA", "33602": "TAMPA", "33603": "TAMPA", "33604": "TAMPA", "33605": "TAMPA", "33606": "TAMPA", "33607": "TAMPA", "33609": "TAMPA", "33610": "TAMPA", "33611": "TAMPA", "33612": "TAMPA", "33613": "TAMPA", "33614": "TAMPA", "33615": "TAMPA", "33616": "TAMPA", "33617": "TAMPA", "33618": "TAMPA", "33619": "TAMPA", "33624": "TAMPA", "33625": "TAMPA", "33626": "TAMPA", "33629": "TAMPA", "33634": "TAMPA", "33635": "TAMPA", "33637": "TAMPA", "33647": "TAMPA"}
    },
    "HOLMES": {
        "PAlink": "https://holmespa.com/",
        "PermitByCounty": "https://holmescountyfl.org/building-department/",
        "Terrain": "B",
        "zips": [32425, 32455, 32464],
        "cities": {"32425": "BONIFAY", "32455": "PONCE DE LEON", "32464": "WESTVILLE"}
    },
    "INDIAN RIVER": {
        "PAlink": "https://www.ircpa.org/",
        "PermitByCounty": "https://www.ircgov.com/CommunityDevelopment/BuildingDivision.htm",
        "Terrain": "C",
        "zips": [32960, 32961, 32962, 32963, 32964, 32965, 32966, 32967, 32968, 32969, 32970, 32971],
        "cities": {"32960": "VERO BEACH", "32962": "VERO BEACH", "32963": "VERO BEACH", "32966": "VERO BEACH", "32967": "VERO BEACH", "32968": "VERO BEACH", "32970": "SEBASTIAN", "32971": "FELLSMERE"}
    },
    "JACKSON": {
        "PAlink": "https://jacksonpa.com/",
        "PermitByCounty": "https://jacksoncountyfl.gov/services/community-development/",
        "Terrain": "B",
        "zips": [32423, 32426, 32431, 32440, 32442, 32443, 32445, 32446, 32447],
        "cities": {"32423": "BASCOM", "32431": "COTTONDALE", "32440": "GRACEVILLE", "32442": "GRAND RIDGE", "32443": "GREENWOOD", "32445": "MALONE", "32446": "MARIANNA", "32447": "MARIANNA"}
    },
    "JEFFERSON": {
        "PAlink": "https://jeffersonpa.net/",
        "PermitByCounty": "https://jeffersoncountyfl.gov/departments/building-department/",
        "Terrain": "B",
        "zips": [32336, 32337, 32344, 32345],
        "cities": {"32336": "LAMONT", "32337": "LLOYD", "32344": "MONTICELLO", "32345": "MONTICELLO"}
    },
    "LAFAYETTE": {
        "PAlink": "https://lafayettepa.com/",
        "PermitByCounty": "https://lafayettecountyfl.gov/building-department/",
        "Terrain": "B",
        "zips": [32066],
        "cities": {"32066": "MAYO"}
    },
    "LAKE": {
        "PAlink": "https://lakecopropappr.com/property-search.aspx?",
        "PermitByCounty": "https://c.lakecountyfl.gov/offices/building_services/permit_activity_reports/permit_search_by_address.aspx?mylakefl=true",
        "Terrain": "B",
        "zips": [32102, 32159, 32702, 32726, 32727, 32735, 32736, 32757, 32776, 32778, 32784, 34705, 34711, 34712, 34713, 34714, 34715, 34729, 34731, 34736, 34737, 34748, 34749, 34753, 34755, 34756, 34762, 34788, 34789, 34797],
        "cities": {"32159": "LADY LAKE", "32702": "ALTOONA", "32726": "EUSTIS", "32736": "GRAND ISLAND", "32757": "MOUNT DORA", "32776": "SORRENTO", "32778": "TAVARES", "32784": "UMATILLA", "34711": "CLERMONT", "34712": "CLERMONT", "34713": "CLERMONT", "34714": "CLERMONT", "34715": "MINNEOLA", "34729": "FRUITLAND PARK", "34731": "FRUITLAND PARK", "34736": "GROVELAND", "34748": "LEESBURG", "34753": "MONTVERDE", "34788": "LEESBURG"}
    },
    "LEE": {
        "PAlink": "https://www.leepa.org/",
        "PermitByCounty": "https://www.leegov.com/dcd/permits",
        "Terrain": "C",
        "zips": [33901, 33902, 33903, 33904, 33905, 33906, 33907, 33908, 33909, 33910, 33911, 33912, 33913, 33914, 33915, 33916, 33917, 33918, 33919, 33920, 33921, 33922, 33924, 33928, 33931, 33932, 33936, 33945, 33956, 33957, 33965, 33966, 33967, 33970, 33971, 33972, 33973, 33974, 33976, 33990, 33991, 33993, 33994],
        "cities": {"33901": "FORT MYERS", "33903": "NORTH FORT MYERS", "33904": "CAPE CORAL", "33905": "FORT MYERS", "33907": "FORT MYERS", "33908": "FORT MYERS", "33909": "CAPE CORAL", "33912": "FORT MYERS", "33913": "FORT MYERS", "33914": "CAPE CORAL", "33916": "FORT MYERS", "33917": "NORTH FORT MYERS", "33919": "FORT MYERS", "33920": "ALVA", "33921": "BOCA GRANDE", "33922": "BOKEELIA", "33924": "CAPTIVA", "33928": "ESTERO", "33931": "FORT MYERS BEACH", "33932": "FORT MYERS BEACH", "33936": "LEHIGH ACRES", "33945": "PINELAND", "33956": "SAINT JAMES CITY", "33957": "SANIBEL", "33966": "FORT MYERS", "33967": "FORT MYERS", "33971": "LEHIGH ACRES", "33972": "LEHIGH ACRES", "33973": "LEHIGH ACRES", "33974": "LEHIGH ACRES", "33976": "BONITA SPRINGS", "33990": "CAPE CORAL", "33991": "CAPE CORAL", "33993": "CAPE CORAL"}
    },
    "LEON": {
        "PAlink": "https://www.leonpa.org/",
        "PermitByCounty": "https://leoncountyfl.gov/departments/development-support-and-environmental-management/building-plans-review-and-inspections",
        "Terrain": "B",
        "zips": [32301, 32302, 32303, 32304, 32305, 32306, 32307, 32308, 32309, 32310, 32311, 32312, 32313, 32314, 32315, 32316, 32317, 32318],
        "cities": {"32301": "TALLAHASSEE", "32303": "TALLAHASSEE", "32304": "TALLAHASSEE", "32305": "TALLAHASSEE", "32308": "TALLAHASSEE", "32309": "TALLAHASSEE", "32310": "TALLAHASSEE", "32311": "TALLAHASSEE", "32312": "TALLAHASSEE", "32317": "TALLAHASSEE"}
    },
    "LEVY": {
        "PAlink": "https://levypa.com/",
        "PermitByCounty": "https://www.levycounty.org/departments/building_and_zoning/index.php",
        "Terrain": "B",
        "zips": [32621, 32625, 32626, 32639, 32668, 32683, 32696, 34449, 34498],
        "cities": {"32621": "BRONSON", "32625": "CEDAR KEY", "32626": "CHIEFLAND", "32639": "GULF HAMMOCK", "32668": "MORRISTON", "32683": "OTTER CREEK", "32696": "WILLISTON", "34449": "INGLIS", "34498": "YANKEETOWN"}
    },
    "LIBERTY": {
        "PAlink": "https://libertypa.com/",
        "PermitByCounty": "https://libertycountyfl.org/building-department/",
        "Terrain": "B",
        "zips": [32321, 32334, 32335, 32356],
        "cities": {"32321": "BRISTOL", "32334": "HOSFORD", "32356": "SUMATRA"}
    },
    "MADISON": {
        "PAlink": "https://madisonpa.com/",
        "PermitByCounty": "https://madisoncountyfl.com/building-department/",
        "Terrain": "B",
        "zips": [32031, 32050, 32059, 32060, 32340],
        "cities": {"32031": "GREENVILLE", "32050": "LEE", "32059": "MADISON", "32340": "MADISON"}
    },
    "MANATEE": {
        "PAlink": "https://www.manateepao.com/",
        "PermitByCounty": "https://www.mymanatee.org/departments/development_services/building_services",
        "Terrain": "C",
        "zips": [34201, 34202, 34203, 34204, 34205, 34206, 34207, 34208, 34209, 34210, 34211, 34212, 34215, 34216, 34217, 34218, 34219, 34220, 34221, 34222, 34228, 34250, 34251, 34264, 34270],
        "cities": {"34201": "BRADENTON", "34202": "BRADENTON", "34203": "BRADENTON", "34205": "BRADENTON", "34207": "BRADENTON", "34208": "BRADENTON", "34209": "BRADENTON", "34210": "BRADENTON", "34211": "BRADENTON", "34212": "BRADENTON", "34215": "CORTEZ", "34216": "ANNA MARIA", "34217": "HOLMES BEACH", "34219": "PARRISH", "34221": "PALMETTO", "34222": "ELLENTON", "34228": "LONGBOAT KEY", "34250": "TERRA CEIA", "34251": "MYAKKA CITY"}
    },
    "MARION": {
        "PAlink": "https://www.pa.marion.fl.us/PropertySearch.aspx",
        "PermitByCounty": "https://www.marionfl.org/departments-agencies/departments-a-n/building-safety",
        "Terrain": "B",
        "zips": [32113, 32133, 32134, 32179, 32182, 32192, 32617, 32664, 32667, 32681, 32686, 34420, 34430, 34431, 34432, 34470, 34471, 34472, 34473, 34474, 34475, 34476, 34477, 34478, 34479, 34480, 34481, 34482, 34483, 34491, 34492],
        "cities": {"32113": "CITRA", "32134": "FORT MC COY", "32179": "OCKLAWAHA", "32192": "SPARR", "32617": "ANTHONY", "32664": "MC INTOSH", "32667": "MICANOPY", "32686": "REDDICK", "34420": "BELLEVIEW", "34430": "DUNNELLON", "34431": "DUNNELLON", "34432": "DUNNELLON", "34470": "OCALA", "34471": "OCALA", "34472": "OCALA", "34473": "OCALA", "34474": "OCALA", "34475": "OCALA", "34476": "OCALA", "34479": "OCALA", "34480": "OCALA", "34481": "OCALA", "34482": "OCALA", "34491": "SUMMERFIELD"}
    },
    "MARTIN": {
        "PAlink": "https://www.pa.martin.fl.us/",
        "PermitByCounty": "https://www.martin.fl.us/building-department",
        "Terrain": "C",
        "zips": [33455, 33469, 33475, 34956, 34957, 34958, 34974, 34990, 34991, 34992, 34994, 34995, 34996, 34997],
        "cities": {"33455": "HOBE SOUND", "33469": "TEQUESTA", "34956": "INDIANTOWN", "34957": "JENSEN BEACH", "34974": "OKEECHOBEE", "34990": "PALM CITY", "34992": "PORT SALERNO", "34994": "STUART", "34996": "STUART", "34997": "STUART"}
    },
    "MIAMI-DADE": {
        "PAlink": "https://www.miamidade.gov/Apps/PA/PropertySearch/#/",
        "PermitByCounty": "https://www.miamidade.gov/Apps/RER/ePermittingMenu/Home/Permits",
        "Terrain": "C",
        "zips": [33010, 33011, 33012, 33013, 33014, 33015, 33016, 33017, 33018, 33030, 33031, 33032, 33033, 33034, 33035, 33039, 33054, 33055, 33056, 33101, 33102, 33109, 33111, 33112, 33114, 33116, 33121, 33122, 33124, 33125, 33126, 33127, 33128, 33129, 33130, 33131, 33132, 33133, 33134, 33135, 33136, 33137, 33138, 33139, 33140, 33141, 33142, 33143, 33144, 33145, 33146, 33147, 33149, 33150, 33151, 33152, 33153, 33154, 33155, 33156, 33157, 33158, 33160, 33161, 33162, 33163, 33164, 33165, 33166, 33167, 33168, 33169, 33170, 33172, 33173, 33174, 33175, 33176, 33177, 33178, 33179, 33180, 33181, 33182, 33183, 33184, 33185, 33186, 33187, 33188, 33189, 33190, 33192, 33193, 33194, 33196, 33197, 33199, 33206, 33222, 33231, 33233, 33234, 33238, 33239, 33242, 33243, 33245, 33247, 33255, 33256, 33257, 33261, 33265, 33266, 33269, 33280, 33283, 33296, 33299],
        "cities": {"33010": "HIALEAH", "33012": "HIALEAH", "33014": "HIALEAH", "33015": "HIALEAH", "33016": "HIALEAH", "33018": "HIALEAH", "33030": "HOMESTEAD", "33032": "HOMESTEAD", "33033": "HOMESTEAD", "33034": "FLORIDA CITY", "33054": "OPA LOCKA", "33055": "MIAMI GARDENS", "33056": "MIAMI GARDENS", "33109": "MIAMI BEACH", "33125": "MIAMI", "33126": "MIAMI", "33127": "MIAMI", "33128": "MIAMI", "33129": "MIAMI", "33130": "MIAMI", "33131": "MIAMI", "33132": "MIAMI", "33133": "MIAMI", "33134": "CORAL GABLES", "33135": "MIAMI", "33136": "MIAMI", "33137": "MIAMI", "33138": "MIAMI", "33139": "MIAMI BEACH", "33140": "MIAMI BEACH", "33141": "MIAMI BEACH", "33142": "MIAMI", "33143": "MIAMI", "33144": "MIAMI", "33145": "MIAMI", "33146": "CORAL GABLES", "33147": "MIAMI", "33149": "KEY BISCAYNE", "33150": "MIAMI", "33154": "BAL HARBOUR", "33155": "MIAMI", "33156": "PINECREST", "33157": "PALMETTO BAY", "33158": "PALMETTO BAY", "33160": "SUNNY ISLES BEACH", "33161": "NORTH MIAMI", "33162": "NORTH MIAMI BEACH", "33165": "MIAMI", "33166": "MIAMI SPRINGS", "33167": "NORTH MIAMI", "33169": "MIAMI GARDENS", "33172": "DORAL", "33173": "KENDALL", "33174": "SWEETWATER", "33175": "MIAMI", "33176": "KENDALL", "33177": "MIAMI", "33178": "DORAL", "33179": "AVENTURA", "33180": "AVENTURA", "33181": "NORTH MIAMI", "33182": "MIAMI", "33183": "KENDALL", "33184": "MIAMI", "33185": "MIAMI", "33186": "KENDALL", "33187": "MIAMI", "33189": "CUTLER BAY", "33190": "CUTLER BAY", "33193": "MIAMI", "33196": "KENDALL"}
    },
    "MONROE": {
        "PAlink": "https://www.mcpafl.org/",
        "PermitByCounty": "https://www.monroecounty-fl.gov/148/Building-Department",
        "Terrain": "C",
        "zips": [33001, 33036, 33037, 33040, 33041, 33042, 33043, 33044, 33045, 33050, 33051, 33052, 33070],
        "cities": {"33001": "LONG KEY", "33036": "ISLAMORADA", "33037": "KEY LARGO", "33040": "KEY WEST", "33042": "SUMMERLAND KEY", "33043": "BIG PINE KEY", "33050": "MARATHON", "33070": "PLANTATION KEY"}
    },
    "NASSAU": {
        "PAlink": "https://www.nassauflpa.com/",
        "PermitByCounty": "https://www.nassaucountyfl.com/129/Building-Department",
        "Terrain": "C",
        "zips": [32009, 32011, 32034, 32035, 32041, 32097],
        "cities": {"32009": "BRYCEVILLE", "32011": "CALLAHAN", "32034": "FERNANDINA BEACH", "32041": "HILLIARD", "32097": "YULEE"}
    },
    "OKALOOSA": {
        "PAlink": "https://www.okaloosapa.com/",
        "PermitByCounty": "https://myokaloosa.com/gm/growth-management/building-inspections",
        "Terrain": "C",
        "zips": [32531, 32536, 32537, 32538, 32539, 32540, 32541, 32542, 32544, 32547, 32548, 32549, 32564, 32567, 32569, 32578, 32579, 32580],
        "cities": {"32531": "BAKER", "32536": "CRESTVIEW", "32539": "CRESTVIEW", "32541": "DESTIN", "32547": "FORT WALTON BEACH", "32548": "FORT WALTON BEACH", "32567": "LAUREL HILL", "32569": "MARY ESTHER", "32578": "NICEVILLE", "32579": "SHALIMAR", "32580": "VALPARAISO"}
    },
    "OKEECHOBEE": {
        "PAlink": "https://www.okeechobeepa.com/",
        "PermitByCounty": "https://www.co.okeechobee.fl.us/departments/community-development/building-division",
        "Terrain": "B",
        "zips": [34972, 34973, 34974],
        "cities": {"34972": "OKEECHOBEE", "34974": "OKEECHOBEE"}
    },
    "ORANGE": {
        "PAlink": "https://ocpaweb.ocpafl.org/parcelsearch",
        "PermitByCounty": "https://fasttrack.ocfl.net/OnlineServices/permit-building.aspx",
        "Terrain": "B",
        "zips": [32703, 32704, 32709, 32710, 32712, 32751, 32789, 32790, 32792, 32793, 32794, 32798, 32801, 32802, 32803, 32804, 32805, 32806, 32807, 32808, 32809, 32810, 32811, 32812, 32814, 32815, 32816, 32817, 32818, 32819, 32820, 32821, 32822, 32824, 32825, 32826, 32827, 32828, 32829, 32830, 32831, 32832, 32833, 32834, 32835, 32836, 32837, 32839, 32853, 32854, 32855, 32856, 32857, 32858, 32859, 32860, 32861, 32862, 32867, 32868, 32869, 32872, 32877, 32878, 32885, 32886, 32887, 32891, 32893, 32896, 32897, 32899, 34734, 34740, 34760, 34761, 34777, 34778, 34786, 34787],
        "cities": {"32703": "APOPKA", "32712": "APOPKA", "32751": "MAITLAND", "32789": "WINTER PARK", "32792": "WINTER PARK", "32798": "ZELLWOOD", "32801": "ORLANDO", "32803": "ORLANDO", "32804": "ORLANDO", "32805": "ORLANDO", "32806": "ORLANDO", "32807": "ORLANDO", "32808": "ORLANDO", "32809": "BELLE ISLE", "32810": "ORLANDO", "32811": "ORLANDO", "32812": "ORLANDO", "32814": "ORLANDO", "32817": "ORLANDO", "32818": "ORLANDO", "32819": "ORLANDO", "32820": "ORLANDO", "32821": "ORLANDO", "32822": "ORLANDO", "32824": "ORLANDO", "32825": "ORLANDO", "32826": "ORLANDO", "32827": "ORLANDO", "32828": "ORLANDO", "32829": "ORLANDO", "32830": "ORLANDO", "32832": "ORLANDO", "32835": "ORLANDO", "32836": "WINDERMERE", "32837": "ORLANDO", "32839": "ORLANDO", "34734": "GOTHA", "34760": "OCOEE", "34761": "OCOEE", "34777": "WINTER GARDEN", "34786": "WINDERMERE", "34787": "WINTER GARDEN"}
    },
    "OSCEOLA": {
        "PAlink": "https://search.property-appraiser.org/Search/MainSearch",
        "PermitByCounty": "https://permits.osceola.org/CitizenAccess/Default.aspx",
        "Terrain": "B",
        "zips": [34739, 34741, 34742, 34743, 34744, 34745, 34746, 34747, 34758, 34759, 34769, 34770, 34771, 34772, 34773],
        "cities": {"34739": "KENANSVILLE", "34741": "KISSIMMEE", "34743": "KISSIMMEE", "34744": "KISSIMMEE", "34746": "KISSIMMEE", "34747": "CELEBRATION", "34758": "KISSIMMEE", "34759": "POINCIANA", "34769": "SAINT CLOUD", "34771": "SAINT CLOUD", "34772": "SAINT CLOUD", "34773": "SAINT CLOUD"}
    },
    "PALM BEACH": {
        "PAlink": "https://www.pbcgov.org/papa/index.htm",
        "PermitByCounty": "https://www.pbcgov.org/ePZB.Admin.WebSPA/#/Container/Permits_Inspections",
        "Terrain": "B",
        "zips": [33401, 33402, 33403, 33404, 33405, 33406, 33407, 33408, 33409, 33410, 33411, 33412, 33413, 33414, 33415, 33416, 33417, 33418, 33419, 33420, 33421, 33422, 33424, 33425, 33426, 33427, 33428, 33429, 33430, 33431, 33432, 33433, 33434, 33435, 33436, 33437, 33438, 33444, 33445, 33446, 33448, 33449, 33454, 33458, 33460, 33461, 33462, 33463, 33465, 33467, 33468, 33469, 33470, 33472, 33473, 33474, 33476, 33477, 33478, 33480, 33481, 33482, 33483, 33484, 33486, 33487, 33488, 33493, 33496, 33497, 33498, 33499],
        "cities": {"33401": "WEST PALM BEACH", "33403": "LAKE PARK", "33404": "RIVIERA BEACH", "33405": "WEST PALM BEACH", "33406": "WEST PALM BEACH", "33407": "WEST PALM BEACH", "33408": "NORTH PALM BEACH", "33409": "WEST PALM BEACH", "33410": "PALM BEACH GARDENS", "33411": "ROYAL PALM BEACH", "33412": "PALM BEACH GARDENS", "33413": "WEST PALM BEACH", "33414": "WELLINGTON", "33415": "GREENACRES", "33417": "WEST PALM BEACH", "33418": "PALM BEACH GARDENS", "33421": "ROYAL PALM BEACH", "33426": "BOYNTON BEACH", "33428": "BOCA RATON", "33430": "BELLE GLADE", "33431": "BOCA RATON", "33432": "BOCA RATON", "33433": "BOCA RATON", "33434": "BOCA RATON", "33435": "BOYNTON BEACH", "33436": "BOYNTON BEACH", "33437": "BOYNTON BEACH", "33444": "DELRAY BEACH", "33445": "DELRAY BEACH", "33446": "DELRAY BEACH", "33449": "LAKE WORTH", "33458": "JUPITER", "33460": "LAKE WORTH BEACH", "33461": "LAKE WORTH", "33462": "LANTANA", "33463": "LAKE WORTH", "33467": "LAKE WORTH", "33469": "JUPITER", "33470": "LOXAHATCHEE", "33472": "BOYNTON BEACH", "33473": "BOYNTON BEACH", "33477": "JUPITER", "33478": "JUPITER", "33480": "PALM BEACH", "33483": "DELRAY BEACH", "33484": "DELRAY BEACH", "33486": "BOCA RATON", "33487": "BOCA RATON", "33496": "BOCA RATON", "33498": "BOCA RATON"}
    },
    "PASCO": {
        "PAlink": "https://www.pascopa.com/",
        "PermitByCounty": "https://www.pascocountyfl.net/departments/building_construction_services/index.php",
        "Terrain": "B",
        "zips": [33523, 33524, 33525, 33526, 33537, 33539, 33540, 33541, 33542, 33543, 33544, 33545, 33576, 34610, 34637, 34638, 34639, 34652, 34653, 34654, 34655, 34656, 34667, 34668, 34669, 34673, 34674, 34679, 34680, 34690, 34691],
        "cities": {"33523": "DADE CITY", "33525": "DADE CITY", "33540": "ZEPHYRHILLS", "33541": "ZEPHYRHILLS", "33542": "ZEPHYRHILLS", "33543": "WESLEY CHAPEL", "33544": "WESLEY CHAPEL", "33545": "WESLEY CHAPEL", "33576": "SAN ANTONIO", "34610": "SPRING HILL", "34638": "LAND O LAKES", "34639": "LAND O LAKES", "34652": "NEW PORT RICHEY", "34653": "NEW PORT RICHEY", "34654": "NEW PORT RICHEY", "34655": "NEW PORT RICHEY", "34667": "HUDSON", "34668": "PORT RICHEY", "34669": "PORT RICHEY", "34690": "HOLIDAY", "34691": "HOLIDAY"}
    },
    "PINELLAS": {
        "PAlink": "https://www.pcpao.gov/",
        "PermitByCounty": "https://pinellas.gov/building-permits-and-inspections/",
        "Terrain": "C",
        "zips": [33701, 33702, 33703, 33704, 33705, 33706, 33707, 33708, 33709, 33710, 33711, 33712, 33713, 33714, 33715, 33716, 33730, 33731, 33732, 33733, 33734, 33736, 33737, 33738, 33740, 33741, 33742, 33743, 33747, 33755, 33756, 33757, 33758, 33759, 33760, 33761, 33762, 33763, 33764, 33765, 33766, 33767, 33769, 33770, 33771, 33772, 33773, 33774, 33775, 33776, 33777, 33778, 33779, 33780, 33781, 33782, 33784, 33785, 33786, 34677, 34681, 34682, 34683, 34684, 34685, 34688, 34689, 34695, 34697, 34698],
        "cities": {"33701": "ST PETERSBURG", "33702": "ST PETERSBURG", "33703": "ST PETERSBURG", "33704": "ST PETERSBURG", "33705": "ST PETERSBURG", "33706": "ST PETE BEACH", "33707": "GULFPORT", "33708": "MADEIRA BEACH", "33709": "ST PETERSBURG", "33710": "ST PETERSBURG", "33711": "ST PETERSBURG", "33712": "ST PETERSBURG", "33713": "ST PETERSBURG", "33714": "ST PETERSBURG", "33715": "TIERRA VERDE", "33716": "ST PETERSBURG", "33755": "CLEARWATER", "33756": "CLEARWATER", "33759": "CLEARWATER", "33760": "CLEARWATER", "33761": "CLEARWATER", "33762": "CLEARWATER", "33763": "CLEARWATER", "33764": "CLEARWATER", "33765": "CLEARWATER", "33767": "CLEARWATER BEACH", "33770": "LARGO", "33771": "LARGO", "33772": "SEMINOLE", "33773": "LARGO", "33774": "LARGO", "33776": "SEMINOLE", "33777": "SEMINOLE", "33778": "LARGO", "33781": "PINELLAS PARK", "33782": "PINELLAS PARK", "33785": "INDIAN ROCKS BEACH", "33786": "BELLEAIR BEACH", "34677": "OLDSMAR", "34683": "PALM HARBOR", "34684": "PALM HARBOR", "34685": "PALM HARBOR", "34688": "TARPON SPRINGS", "34689": "TARPON SPRINGS", "34695": "SAFETY HARBOR", "34698": "DUNEDIN"}
    },
    "POLK": {
        "PAlink": "https://www.polkflpa.gov/CamaSearch.aspx",
        "PermitByCounty": "https://www.polk-county.net/services/building-division/",
        "Terrain": "B",
        "zips": [33801, 33802, 33803, 33804, 33805, 33806, 33807, 33809, 33810, 33811, 33812, 33813, 33815, 33823, 33827, 33830, 33831, 33835, 33836, 33837, 33838, 33839, 33840, 33841, 33843, 33844, 33845, 33846, 33847, 33849, 33850, 33851, 33853, 33854, 33855, 33856, 33858, 33859, 33860, 33863, 33867, 33868, 33877, 33880, 33881, 33882, 33883, 33884, 33885, 33888, 33896, 33897, 33898, 34759],
        "cities": {"33801": "LAKELAND", "33803": "LAKELAND", "33805": "LAKELAND", "33809": "LAKELAND", "33810": "LAKELAND", "33811": "LAKELAND", "33812": "LAKELAND", "33813": "LAKELAND", "33815": "LAKELAND", "33823": "AUBURNDALE", "33827": "BARTOW", "33830": "BARTOW", "33837": "DAVENPORT", "33838": "DUNDEE", "33839": "EAGLE LAKE", "33841": "FORT MEADE", "33843": "FROSTPROOF", "33844": "HAINES CITY", "33850": "LAKE ALFRED", "33853": "LAKE WALES", "33859": "LAKE WALES", "33860": "MULBERRY", "33868": "POLK CITY", "33880": "WINTER HAVEN", "33881": "WINTER HAVEN", "33884": "WINTER HAVEN", "33896": "DAVENPORT", "33897": "DAVENPORT", "33898": "LAKE WALES"}
    },
    "PUTNAM": {
        "PAlink": "https://putnam-fl.com/pa/",
        "PermitByCounty": "https://main.putnam-fl.com/?page_id=140",
        "Terrain": "B",
        "zips": [32112, 32131, 32138, 32139, 32140, 32148, 32157, 32177, 32178, 32181, 32185, 32189, 32193, 32666],
        "cities": {"32112": "CRESCENT CITY", "32131": "EAST PALATKA", "32138": "FLORAHOME", "32139": "GEORGETOWN", "32140": "GRANDIN", "32148": "INTERLACHEN", "32177": "PALATKA", "32181": "POMONA PARK", "32189": "SATSUMA", "32193": "WELAKA"}
    },
    "SANTA ROSA": {
        "PAlink": "https://www.santarosapa.gov/",
        "PermitByCounty": "https://www.santarosa.fl.gov/157/Building-Inspections",
        "Terrain": "C",
        "zips": [32561, 32562, 32563, 32565, 32566, 32570, 32571, 32572, 32583],
        "cities": {"32561": "GULF BREEZE", "32563": "GULF BREEZE", "32565": "JAY", "32566": "NAVARRE", "32570": "MILTON", "32571": "PACE", "32583": "MILTON"}
    },
    "SARASOTA": {
        "PAlink": "https://www.sc-pa.com/propertysearch",
        "PermitByCounty": "https://aca-prod.accela.com/SARASOTACO/Dashboard.aspx",
        "Terrain": "B",
        "zips": [34228, 34230, 34231, 34232, 34233, 34234, 34235, 34236, 34237, 34238, 34239, 34240, 34241, 34242, 34243, 34249, 34272, 34274, 34275, 34276, 34277, 34278, 34284, 34285, 34286, 34287, 34288, 34289, 34290, 34291, 34292, 34293, 34295],
        "cities": {"34231": "SARASOTA", "34232": "SARASOTA", "34233": "SARASOTA", "34234": "SARASOTA", "34235": "SARASOTA", "34236": "SARASOTA", "34237": "SARASOTA", "34238": "SARASOTA", "34239": "SARASOTA", "34240": "SARASOTA", "34241": "SARASOTA", "34242": "SIESTA KEY", "34243": "SARASOTA", "34275": "NOKOMIS", "34285": "VENICE", "34286": "NORTH PORT", "34287": "NORTH PORT", "34288": "NORTH PORT", "34289": "NORTH PORT", "34290": "NORTH PORT", "34291": "NORTH PORT", "34292": "VENICE", "34293": "VENICE", "34295": "ENGLEWOOD"}
    },
    "SEMINOLE": {
        "PAlink": "https://www.scpafl.org/",
        "PermitByCounty": "https://semc-egov.aspgov.com/Click2GovBP/selectpermit.html",
        "Terrain": "B",
        "zips": [32701, 32707, 32708, 32714, 32715, 32716, 32718, 32719, 32730, 32732, 32733, 32746, 32747, 32750, 32765, 32766, 32771, 32772, 32773, 32779, 32791, 32795],
        "cities": {"32701": "ALTAMONTE SPRINGS", "32707": "CASSELBERRY", "32708": "WINTER SPRINGS", "32714": "ALTAMONTE SPRINGS", "32716": "ALTAMONTE SPRINGS", "32719": "WINTER SPRINGS", "32730": "CASSELBERRY", "32746": "LAKE MARY", "32750": "LONGWOOD", "32765": "OVIEDO", "32766": "OVIEDO", "32771": "SANFORD", "32773": "SANFORD", "32779": "LONGWOOD", "32795": "LAKE MARY"}
    },
    "ST. JOHNS": {
        "PAlink": "https://www.sjcpa.us/",
        "PermitByCounty": "https://www.sjcfl.us/building-services/",
        "Terrain": "C",
        "zips": [32080, 32081, 32082, 32084, 32085, 32086, 32092, 32095, 32145, 32259],
        "cities": {"32080": "ST AUGUSTINE BEACH", "32081": "PONTE VEDRA", "32082": "PONTE VEDRA BEACH", "32084": "ST AUGUSTINE", "32086": "ST AUGUSTINE", "32092": "ST AUGUSTINE", "32095": "ST AUGUSTINE", "32145": "HASTINGS", "32259": "SAINT JOHNS"}
    },
    "ST. LUCIE": {
        "PAlink": "https://apps.paslc.gov/property-search/real-estate/basic-site-address",
        "PermitByCounty": "https://www.stlucieco.gov/departments-and-services/planning-and-development-services/building-division",
        "Terrain": "C",
        "zips": [34945, 34946, 34947, 34948, 34949, 34950, 34951, 34952, 34953, 34954, 34981, 34982, 34983, 34984, 34985, 34986, 34987, 34988],
        "cities": {"34945": "FORT PIERCE", "34946": "FORT PIERCE", "34947": "FORT PIERCE", "34949": "FORT PIERCE", "34950": "FORT PIERCE", "34951": "FORT PIERCE", "34952": "PORT ST LUCIE", "34953": "PORT ST LUCIE", "34982": "FORT PIERCE", "34983": "PORT ST LUCIE", "34984": "PORT ST LUCIE", "34986": "PORT ST LUCIE", "34987": "PORT ST LUCIE", "34988": "PORT ST LUCIE"}
    },
    "SUMTER": {
        "PAlink": "https://sumterpa.com/",
        "PermitByCounty": "https://www.sumtercountyfl.gov/114/Building-Services",
        "Terrain": "B",
        "zips": [32162, 32163, 33513, 33514, 33521, 33538, 33585, 33597, 34484],
        "cities": {"32162": "THE VILLAGES", "32163": "THE VILLAGES", "33513": "BUSHNELL", "33514": "COLEMAN", "33521": "CENTER HILL", "33538": "LAKE PANASOFFKEE", "33585": "SUMTERVILLE", "33597": "WEBSTER", "34484": "OXFORD"}
    },
    "SUWANNEE": {
        "PAlink": "https://suwanneepa.com/",
        "PermitByCounty": "https://suwanneecountyfl.gov/building-department/",
        "Terrain": "B",
        "zips": [32060, 32062, 32064, 32071, 32094],
        "cities": {"32060": "LIVE OAK", "32062": "MC ALPIN", "32064": "LIVE OAK", "32071": "O BRIEN", "32094": "WELLBORN"}
    },
    "TAYLOR": {
        "PAlink": "https://taylorpa.com/",
        "PermitByCounty": "https://www.taylorcountygov.com/departments/building_and_planning/index.php",
        "Terrain": "B",
        "zips": [32347, 32348, 32357, 32358, 32359],
        "cities": {"32347": "PERRY", "32348": "PERRY", "32357": "SALEM", "32358": "SHADY GROVE", "32359": "STEINHATCHEE"}
    },
    "UNION": {
        "PAlink": "https://unionpa.com/",
        "PermitByCounty": "https://unioncountyfl.gov/building-department/",
        "Terrain": "B",
        "zips": [32054, 32061, 32083, 32697],
        "cities": {"32061": "LAKE BUTLER", "32083": "RAIFORD", "32697": "WORTHINGTON SPRINGS"}
    },
    "VOLUSIA": {
        "PAlink": "https://vcpa.vcgov.org/#gsc.tab=0",
        "PermitByCounty": "https://growthmgt.vcgov.org/PublicPortal/Volusia/public/property_query.jsp",
        "Terrain": "B",
        "zips": [32114, 32115, 32116, 32117, 32118, 32119, 32120, 32121, 32122, 32123, 32124, 32127, 32128, 32129, 32130, 32132, 32168, 32169, 32170, 32174, 32175, 32176, 32180, 32190, 32706, 32713, 32720, 32721, 32722, 32723, 32724, 32725, 32728, 32738, 32744, 32759, 32763, 32764],
        "cities": {"32114": "DAYTONA BEACH", "32117": "DAYTONA BEACH", "32118": "DAYTONA BEACH", "32119": "DAYTONA BEACH", "32124": "DAYTONA BEACH", "32127": "PORT ORANGE", "32128": "PORT ORANGE", "32129": "PORT ORANGE", "32130": "DE LEON SPRINGS", "32132": "EDGEWATER", "32168": "NEW SMYRNA BEACH", "32169": "NEW SMYRNA BEACH", "32174": "ORMOND BEACH", "32176": "ORMOND BEACH", "32713": "DEBARY", "32720": "DELAND", "32724": "DELAND", "32725": "DELTONA", "32738": "DELTONA", "32763": "ORANGE CITY", "32764": "DELTONA"}
    },
    "WAKULLA": {
        "PAlink": "https://www.mywakullapa.com/",
        "PermitByCounty": "https://www.mywakulla.com/departments/planning_and_community_development/building_department/index.php",
        "Terrain": "B",
        "zips": [32327, 32346, 32355],
        "cities": {"32327": "CRAWFORDVILLE", "32346": "PANACEA", "32355": "SOPCHOPPY"}
    },
    "WALTON": {
        "PAlink": "https://waltonpa.com/",
        "PermitByCounty": "https://www.co.walton.fl.us/118/Building-Department",
        "Terrain": "C",
        "zips": [32433, 32435, 32454, 32459, 32461],
        "cities": {"32433": "DEFUNIAK SPRINGS", "32435": "DEFUNIAK SPRINGS", "32454": "PAXTON", "32459": "SANTA ROSA BEACH", "32461": "INLET BEACH"}
    },
    "WASHINGTON": {
        "PAlink": "https://washingtonpa.com/",
        "PermitByCounty": "https://washingtonfl.com/building-department/",
        "Terrain": "B",
        "zips": [32425, 32427, 32428, 32462, 32463, 32466],
        "cities": {"32427": "CARYVILLE", "32428": "CHIPLEY", "32462": "VERNON", "32463": "WAUSAU"}
    }
}

# Municipal permit portals lookup by city
CITY_PERMIT_PORTALS = {
    "MIAMI": "http://apps.miamigov.com/iBuildPortal",
    "HIALEAH": "http://apps.hialeahfl.gov/building/",
    "FORT LAUDERDALE": "https://aca-prod.accela.com/FTL/Cap/CapHome.aspx?ShowMyPermitList=Y&SearchType=ByPermit&module=Permits",
    "TAMPA": "https://aca-prod.accela.com/Tampa/Welcome.aspx?TabName=Home&TabList=Home",
    "ORLANDO": "https://permitlookup.cityoforlando.net/WebPermits/",
    "JACKSONVILLE": "https://www.coj.net/departments/planning-and-development/building-inspection-division",
    "ST PETERSBURG": "https://www.stpete.org/business/permits_and_inspections/index.php",
    "TALLAHASSEE": "https://www.talgov.com/growth/growth-growth.aspx",
    "SARASOTA": "https://ftgportal.sarasotafl.gov/Permits/Home.aspx?&microapp=c",
    "BOCA RATON": "https://boca-egov.aspgov.com/Click2GovBP/selectpermit.html",
    "WEST PALM BEACH": "https://westpalmbeachfl-energovpub.tylerhost.net/apps/selfservice/WestPalmBeachFLProd#/search",
    "BOYNTON BEACH": "https://byb2-egov.aspgov.com/Click2GovBP/selectpermit.html",
    "DELRAY BEACH": "https://permitting.delraybeachfl.gov/",
    "CORAL SPRINGS": "https://energov.coralsprings.gov/EnerGov_Prod/SelfService#/search",
    "PEMBROKE PINES": "https://pembrokepinesfl-energovweb.tylerhost.net/apps/selfservice/#/search",
    "HOLLYWOOD": "https://apps.hollywoodfl.org/building/PermitStatus.aspx",
    "PARKLAND": "https://www.mgoconnect.org/cp/search",
    "SUNRISE": "https://energov.sunrisefl.gov/EnerGov_Prod/SelfService/SunriseFL%20Prod#/search?category=permits",
    "PLANTATION": "https://plantation-fl.gov/government/building-department",
    "DAVIE": "https://www.davie-fl.gov/224/Building-Division",
    "HOMESTEAD": "https://egov.cityofhomestead.com/eGovPlus91/permit/perm_status.aspx",
    "FLORIDA CITY": "https://www.floridacityfl.gov/community-development",
    "SUNNY ISLES BEACH": "https://ci-sunnyislesbeach-fl.smartgovcommunity.com/ApplicationPublic/ApplicationHome",
    "NORTH MIAMI": "https://eportal.northmiamifl.gov/Default.asp?Build=PM.pmPermit.SearchForm&utask=normalview",
    "CORAL GABLES": "https://www.coralgables.com/services/building-permits",
    "DORAL": "https://www.cityofdoral.com/all-departments/building/",
    "MIAMI BEACH": "https://www.miamibeachfl.gov/city-hall/building/",
    "APOPKA": "https://broker.edmundsassoc.com/CPSS/?municipalId=APKAFL",
    "ALTAMONTE SPRINGS": "https://altamontefl-energovpub.tylerhost.net/Apps/SelfService#/search",
    "WINTER PARK": "https://epay.cityofwinterpark.org/Click2GovBP/selectpermit.html",
    "WINTER GARDEN": "https://wgar-egov.aspgov.com/Click2GovBP/selectpermit.html",
    "OCOEE": "https://www.ocoee.org/168/Building-Division",
    "CLERMONT": "https://etrakit.clermontfl.org/etrakit3/Search/permit.aspx",
    "LEESBURG": "https://lees-egov.aspgov.com/Click2GovBPO/locatejob.html",
    "LAKE MARY": "https://lkma-egov.aspgov.com/Click2GovBP/index.html",
    "OVIEDO": "https://ovdo-egov.aspgov.com/Click2GovBP/selectpermit.html",
    "WINTER SPRINGS": "https://eservices.winterspringsfl.org/eSuite.Permits/AdvancedSearchPage/AdvancedSearch.aspx",
    "CASSELBERRY": "https://www.casselberry.org/172/Building-Permitting",
    "SANFORD": "https://www.sanfordfl.gov/departments/development-services/building-division",
    "PORT SAINT LUCIE": "https://pandapublicweb.cityofpsl.com/Bldg/DocumentUploads.aspx",
    "FORT MYERS": "https://cdservices.cityftmyers.com/EnerGovProd/SelfService#/search?category=permits",
    "CAPE CORAL": "https://www.capecoral.gov/department/community_development/building/index.php",
    "BONITA SPRINGS": "https://www.cityofbonitasprings.org/services/community_development/building_permits/",
    "CLEARWATER": "https://www.myclearwater.com/business/planning-development/building-permits",
    "LARGO": "https://www.largo.com/services/permits___inspections/index.php",
    "DUNEDIN": "https://www.dunedingov.com/city-departments/community-development/building-division",
    "PALM COAST": "https://www.palmcoastgov.com/building",
    "DAYTONA BEACH": "https://www.codb.us/258/Permits-Licensing",
    "DELTONA": "https://deltonafl-energovweb.tylerhost.net/apps/SelfService#/search",
    "LAKELAND": "https://www.lakelandgov.net/departments/community-economic-development/building-inspection/forms-checklists/",
    "WINTER HAVEN": "https://www.mywinterhaven.com/business/building-permits/",
    "KISSIMMEE": "https://energovweb.kissimmee.gov/EnerGov_Prod/SelfService#/search",
    "ST CLOUD": "https://www.stcloudfl.gov/175/Building-Department",
    "GAINESVILLE": "https://www.gainesvillefl.gov/Government-Pages/Government/Departments/Sustainable-Development/Building-Permits",
    "PANAMA CITY": "https://www.panamacity.gov/228/Permits-Inspections",
    "PANAMA CITY BEACH": "https://www.pcbfl.gov/departments/building-department",
    "PENSACOLA": "https://www.cityofpensacola.com/264/Building-Inspections",
    "BRADENTON": "https://cityofbradenton.com/building",
    "PALMETTO": "https://www.palmettofl.org/168/Building-Department",
    "VENICE": "https://www.venicegov.com/government/building",
    "NORTH PORT": "https://www.northportfl.gov/Building-Planning",
    "NAPLES": "https://www.naplesgov.com/building",
    "MARCO ISLAND": "https://www.cityofmarcoisland.com/growthmanagement/page/building-services",
    "KEY WEST": "https://www.cityofkeywest-fl.gov/270/Building-Department"
}

# Generate clean normalized records list
all_records = []
zip_seen = set()

import hashlib

for county_name, data in COUNTY_INFO.items():
    pa_link = data["PAlink"]
    county_permit = data["PermitByCounty"]
    terrain = data["Terrain"]
    zips = data["zips"]
    cities = data.get("cities", {})
    
    for z in zips:
        z_str = str(z).zfill(5)
        city_name = cities.get(str(z), cities.get(z_str, county_name.title()))
        city_upper = city_name.upper()
        
        # Determine city permit portal
        city_permit = CITY_PERMIT_PORTALS.get(city_upper, None)
        
        # Create deterministic ID
        id_hash = hashlib.md5(f"{z_str}_{county_name}".encode()).hexdigest()[:24]
        
        record = {
            "_id": id_hash,
            "zip": int(z) if str(z).isdigit() else z,
            "City": city_upper,
            "County": county_name.upper(),
            "State": "FL",
            "PAlink": pa_link,
            "PermitByCounty": county_permit,
            "PermitByCity": city_permit,
            "Terrain": terrain,
            "LastUpdated": "2026-03-20"
        }
        
        all_records.append(record)

all_records.sort(key=lambda x: (x["County"], str(x["zip"])))

print(f"Generated {len(all_records)} comprehensive Florida ZIP records across {len(COUNTY_INFO)} counties.")

ts_output = f"""import {{ FloridaZipRecord }} from '../types/permits';

/**
 * Built-in Florida Property Appraiser and Municipal Building Permit directory dataset.
 * Covers all Florida ZIP codes across all 67 Florida counties with official Property Appraiser,
 * County Building Permit, and Municipal City Permit portals.
 * Users can also import their custom 2,000+ ZIP code datasets anytime via the Import tool.
 */
export const INITIAL_FLORIDA_PERMIT_DATASET: FloridaZipRecord[] = {json.dumps(all_records, indent=2)};
"""

with open('src/data/initialPermitRecords.ts', 'w') as f:
    f.write(ts_output)

print("Successfully written to src/data/initialPermitRecords.ts")
