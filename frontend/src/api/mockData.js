// Comprehensive Wholesale Electronic Gadgets Dataset with 26+ Products, Variants, Units & Procurement Records

export const mockProducts = [
  {
    _id: "P01",
    name: "Fast Charger",
    category: "Chargers",
    sku: "CHG-01",
    brand: "VoltPro",
    price: 350,
    stock: 8, // Needs Restock!
    minStock: 25,
    branch: "Coimbatore",
    description: "Multi-voltage rapid charger for smartphones and tablets.",
    variants: [
      {
        typeName: "20W Type-C Adapter",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 350 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 3200 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 15000 },
        ],
      },
      {
        typeName: "33W Flash Charger",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 550 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 5000 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 23500 },
        ],
      },
      {
        typeName: "65W GaN Triple Port",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1200 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 11000 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 52000 },
        ],
      },
    ],
  },
  {
    _id: "P02",
    name: "Power Bank",
    category: "Power Banks",
    sku: "PBK-02",
    brand: "PowerMax",
    price: 850,
    stock: 12, // Needs Restock!
    minStock: 30,
    branch: "Tirupur",
    description: "High-density polymer battery pack with digital LED battery indicator.",
    variants: [
      {
        typeName: "10,000 mAh 20W PD",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 850 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 8000 },
          { unitName: "Master Carton (40 Pcs)", qty: 40, price: 30000 },
        ],
      },
      {
        typeName: "20,000 mAh 22.5W Fast",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1400 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 13200 },
          { unitName: "Master Carton (30 Pcs)", qty: 30, price: 37500 },
        ],
      },
      {
        typeName: "30,000 mAh 65W Laptop PD",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 2400 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 22500 },
          { unitName: "Master Carton (20 Pcs)", qty: 20, price: 43000 },
        ],
      },
    ],
  },
  {
    _id: "P03",
    name: "Wireless Earbuds",
    category: "Audio",
    sku: "EAR-03",
    brand: "Acoustix",
    price: 750,
    stock: 5, // Needs Restock!
    minStock: 25,
    branch: "Coimbatore",
    description: "True wireless stereo Bluetooth earbuds with deep bass audio.",
    variants: [
      {
        typeName: "Standard TWS with Mic",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 750 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 7000 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 33000 },
        ],
      },
      {
        typeName: "ANC 32dB Noise Canceling",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1850 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 17500 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 82000 },
        ],
      },
      {
        typeName: "Gaming Low Latency 40ms",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1100 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 10200 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 48000 },
        ],
      },
    ],
  },
  {
    _id: "P04",
    name: "Smart Watch",
    category: "Wearables",
    sku: "WAT-04",
    brand: "Chronos",
    price: 1350,
    stock: 14, // Needs Restock!
    minStock: 20,
    branch: "Tirupur",
    description: "Bluetooth calling smartwatch with HD display and fitness trackers.",
    variants: [
      {
        typeName: "1.83' HD Calling Watch",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1350 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 12800 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 60000 },
        ],
      },
      {
        typeName: "1.96' AMOLED Curved Display",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 2150 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 20500 },
          { unitName: "Master Carton (30 Pcs)", qty: 30, price: 58500 },
        ],
      },
      {
        typeName: "Rugged Outdoor IP68 Metal",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 2600 },
          { unitName: "Retailer Pack (10 Pcs)", qty: 10, price: 24500 },
          { unitName: "Master Carton (30 Pcs)", qty: 30, price: 70000 },
        ],
      },
    ],
  },
  {
    _id: "P05",
    name: "Wi-Fi Router",
    category: "Networking",
    sku: "RTR-05",
    brand: "NetWave",
    price: 1450,
    stock: 7, // Needs Restock!
    minStock: 20,
    branch: "Coimbatore",
    description: "High speed wireless fiber router with multi-antenna coverage.",
    variants: [
      {
        typeName: "300Mbps Single Band 2.4G",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 950 },
          { unitName: "Wholesale Pack (10 Pcs)", qty: 10, price: 8800 },
          { unitName: "Master Carton (40 Pcs)", qty: 40, price: 33000 },
        ],
      },
      {
        typeName: "1200Mbps Dual Band AC",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1850 },
          { unitName: "Wholesale Pack (10 Pcs)", qty: 10, price: 17500 },
          { unitName: "Master Carton (30 Pcs)", qty: 30, price: 50000 },
        ],
      },
      {
        typeName: "Gigabit Optical Fiber Wi-Fi 6",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 3800 },
          { unitName: "Wholesale Pack (10 Pcs)", qty: 10, price: 36000 },
          { unitName: "Master Carton (20 Pcs)", qty: 20, price: 68000 },
        ],
      },
    ],
  },
  {
    _id: "P06",
    name: "Type-C Cable",
    category: "Cables",
    sku: "CBL-06",
    brand: "CableCraft",
    price: 90,
    stock: 350,
    minStock: 100,
    branch: "Coimbatore",
    description: "Braided high-durability fast charging and data transfer cord.",
    variants: [
      {
        typeName: "60W 1-Meter Braided",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 90 },
          { unitName: "Pack of 20 Pcs", qty: 20, price: 1600 },
          { unitName: "Carton of 200 Pcs", qty: 200, price: 14000 },
        ],
      },
      {
        typeName: "100W 2-Meter Fast PD",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 180 },
          { unitName: "Pack of 20 Pcs", qty: 20, price: 3200 },
          { unitName: "Carton of 100 Pcs", qty: 100, price: 15000 },
        ],
      },
    ],
  },
  {
    _id: "P07",
    name: "Bluetooth Speaker",
    category: "Audio",
    sku: "SPK-07",
    brand: "Acoustix",
    price: 850,
    stock: 9, // Needs Restock!
    minStock: 25,
    branch: "Tirupur",
    description: "Portable wireless soundbox with dynamic RGB party light.",
    variants: [
      {
        typeName: "5W Mini Pocket Speaker",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 450 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 4100 },
          { unitName: "Carton of 50 Pcs", qty: 50, price: 19500 },
        ],
      },
      {
        typeName: "16W Dual Driver Boombox",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1250 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 11800 },
          { unitName: "Carton of 30 Pcs", qty: 30, price: 33500 },
        ],
      },
      {
        typeName: "60W Heavy Bass Party Tower",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 3200 },
          { unitName: "Box of 4 Pcs", qty: 4, price: 12000 },
          { unitName: "Carton of 10 Pcs", qty: 10, price: 28500 },
        ],
      },
    ],
  },
  {
    _id: "P08",
    name: "CCTV Camera",
    category: "Surveillance",
    sku: "CAM-08",
    brand: "SecureVision",
    price: 1650,
    stock: 11, // Needs Restock!
    minStock: 20,
    branch: "Coimbatore",
    description: "Smart wireless security monitoring camera with night vision.",
    variants: [
      {
        typeName: "1080p Wi-Fi Indoor Dome",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1400 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 13000 },
          { unitName: "Carton of 40 Pcs", qty: 40, price: 48000 },
        ],
      },
      {
        typeName: "360° PTZ 2K Smart Camera",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 2200 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 20500 },
          { unitName: "Carton of 30 Pcs", qty: 30, price: 58000 },
        ],
      },
      {
        typeName: "4G Solar Outdoor Bullet",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 4200 },
          { unitName: "Box of 6 Pcs", qty: 6, price: 24000 },
          { unitName: "Carton of 20 Pcs", qty: 20, price: 76000 },
        ],
      },
    ],
  },
  {
    _id: "P09",
    name: "Wireless Neckband",
    category: "Audio",
    sku: "NCK-09",
    brand: "Acoustix",
    price: 490,
    stock: 18, // Needs Restock!
    minStock: 40,
    branch: "Tirupur",
    description: "Magnetic Bluetooth neckband headset with 40-hour long playback.",
    variants: [
      {
        typeName: "30-Hour Standard Bass",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 490 },
          { unitName: "Retailer Pack (20 Pcs)", qty: 20, price: 9000 },
          { unitName: "Master Carton (100 Pcs)", qty: 100, price: 42000 },
        ],
      },
      {
        typeName: "60-Hour Fast Charge ENC",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 750 },
          { unitName: "Retailer Pack (20 Pcs)", qty: 20, price: 14000 },
          { unitName: "Master Carton (100 Pcs)", qty: 100, price: 65000 },
        ],
      },
    ],
  },
  {
    _id: "P10",
    name: "Car Charger",
    category: "Chargers",
    sku: "CAR-10",
    brand: "VoltPro",
    price: 280,
    stock: 6, // Needs Restock!
    minStock: 25,
    branch: "Coimbatore",
    description: "Dual port fast car cigarette lighter adapter with metal body.",
    variants: [
      {
        typeName: "30W Dual USB Quick Charge",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 280 },
          { unitName: "Box of 20 Pcs", qty: 20, price: 5000 },
          { unitName: "Carton of 100 Pcs", qty: 100, price: 23000 },
        ],
      },
      {
        typeName: "65W Type-C Laptop & Phone",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 650 },
          { unitName: "Box of 20 Pcs", qty: 20, price: 12000 },
          { unitName: "Carton of 100 Pcs", qty: 100, price: 55000 },
        ],
      },
    ],
  },
  {
    _id: "P11",
    name: "Keypad Phone",
    category: "Mobile Phones",
    sku: "PHN-11",
    brand: "LiteFone",
    price: 1100,
    stock: 15, // Needs Restock!
    minStock: 30,
    branch: "Tirupur",
    description: "Long battery feature keypad handset with torch and loud speaker.",
    variants: [
      {
        typeName: "2G Dual SIM Basic",
        units: [
          { unitName: "Single Handset (1 Pc)", qty: 1, price: 950 },
          { unitName: "Retailer Box (10 Pcs)", qty: 10, price: 9000 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 42500 },
        ],
      },
      {
        typeName: "4G VoLTE UPI Soundbox",
        units: [
          { unitName: "Single Handset (1 Pc)", qty: 1, price: 1650 },
          { unitName: "Retailer Box (10 Pcs)", qty: 10, price: 15500 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 74000 },
        ],
      },
    ],
  },
  {
    _id: "P12",
    name: "Memory Card",
    category: "Storage",
    sku: "MEM-12",
    brand: "SanFlash",
    price: 240,
    stock: 180,
    minStock: 50,
    branch: "Coimbatore",
    description: "High speed Class 10 MicroSD storage memory chip.",
    variants: [
      {
        typeName: "32GB Class 10 High Speed",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 240 },
          { unitName: "Card Pack (25 Pcs)", qty: 25, price: 5500 },
          { unitName: "Master Carton (200 Pcs)", qty: 200, price: 40000 },
        ],
      },
      {
        typeName: "64GB U3 4K Ready",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 380 },
          { unitName: "Card Pack (25 Pcs)", qty: 25, price: 8750 },
          { unitName: "Master Carton (200 Pcs)", qty: 200, price: 66000 },
        ],
      },
      {
        typeName: "128GB Extreme 100MB/s",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 690 },
          { unitName: "Card Pack (25 Pcs)", qty: 25, price: 16000 },
          { unitName: "Master Carton (200 Pcs)", qty: 200, price: 120000 },
        ],
      },
    ],
  },
  {
    _id: "P13",
    name: "OTG Adapter",
    category: "Cables",
    sku: "OTG-13",
    brand: "CableCraft",
    price: 45,
    stock: 220,
    minStock: 50,
    branch: "Coimbatore",
    description: "Type-C and Micro USB to USB 3.0 metal OTG convertor connector.",
    variants: [
      {
        typeName: "Type-C to USB 3.0 Metal",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 45 },
          { unitName: "Hanger Pack (50 Pcs)", qty: 50, price: 1900 },
          { unitName: "Master Carton (500 Pcs)", qty: 500, price: 16000 },
        ],
      },
      {
        typeName: "2-in-1 Dual OTG Hub",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 85 },
          { unitName: "Hanger Pack (50 Pcs)", qty: 50, price: 3800 },
          { unitName: "Master Carton (500 Pcs)", qty: 500, price: 34000 },
        ],
      },
    ],
  },
  {
    _id: "P14",
    name: "Screen Guard",
    category: "Accessories",
    sku: "SCR-14",
    brand: "GlassShield",
    price: 35,
    stock: 10, // Needs Restock!
    minStock: 100,
    branch: "Tirupur",
    description: "9H hardness tempered edge-to-edge protective screen cover.",
    variants: [
      {
        typeName: "9D HD Clear Glass",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 35 },
          { unitName: "Box of 50 Pcs", qty: 50, price: 1500 },
          { unitName: "Carton of 500 Pcs", qty: 500, price: 12500 },
        ],
      },
      {
        typeName: "Matte Anti-Fingerprint Gaming",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 50 },
          { unitName: "Box of 50 Pcs", qty: 50, price: 2200 },
          { unitName: "Carton of 500 Pcs", qty: 500, price: 19000 },
        ],
      },
    ],
  },
  {
    _id: "P15",
    name: "Phone Case",
    category: "Accessories",
    sku: "CSE-15",
    brand: "CasePro",
    price: 65,
    stock: 310,
    minStock: 80,
    branch: "Coimbatore",
    description: "Shockproof crystal clear TPU back cover with corner air cushions.",
    variants: [
      {
        typeName: "Transparent Silicone Cushion",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 65 },
          { unitName: "Pack of 50 Pcs", qty: 50, price: 2800 },
          { unitName: "Master Carton (400 Pcs)", qty: 400, price: 20000 },
        ],
      },
      {
        typeName: "Magnetic MagSafe Matte Case",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 120 },
          { unitName: "Pack of 50 Pcs", qty: 50, price: 5200 },
          { unitName: "Master Carton (400 Pcs)", qty: 400, price: 38000 },
        ],
      },
    ],
  },
  {
    _id: "P16",
    name: "Wireless Mouse",
    category: "Computer Gadgets",
    sku: "MOU-16",
    brand: "TechClick",
    price: 290,
    stock: 16, // Needs Restock!
    minStock: 30,
    branch: "Coimbatore",
    description: "2.4GHz ergonomic wireless mouse with silent clicks.",
    variants: [
      {
        typeName: "2.4GHz Wireless Silent",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 290 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 2700 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 12500 },
        ],
      },
      {
        typeName: "Rechargeable Dual Mode BT",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 480 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 4400 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 20500 },
        ],
      },
    ],
  },
  {
    _id: "P17",
    name: "USB Hub",
    category: "Computer Gadgets",
    sku: "HUB-17",
    brand: "PortLink",
    price: 320,
    stock: 8, // Needs Restock!
    minStock: 25,
    branch: "Tirupur",
    description: "4-Port high speed multi USB expansion splitter.",
    variants: [
      {
        typeName: "4-Port USB 3.0 Aluminum",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 320 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 2900 },
          { unitName: "Carton of 60 Pcs", qty: 60, price: 16200 },
        ],
      },
      {
        typeName: "7-in-1 Type-C Multiport Dock",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1150 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 10800 },
          { unitName: "Carton of 40 Pcs", qty: 40, price: 40000 },
        ],
      },
    ],
  },
  {
    _id: "P18",
    name: "Gaming Headset",
    category: "Audio",
    sku: "HDS-18",
    brand: "GamerZ",
    price: 890,
    stock: 13, // Needs Restock!
    minStock: 20,
    branch: "Coimbatore",
    description: "Over-ear 7.1 surround sound headset with boom mic and RGB LEDs.",
    variants: [
      {
        typeName: "Wired RGB 50mm Drivers",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 890 },
          { unitName: "Retail Box (10 Pcs)", qty: 10, price: 8400 },
          { unitName: "Master Carton (30 Pcs)", qty: 30, price: 23500 },
        ],
      },
      {
        typeName: "Wireless 2.4G Ultra Latency",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 2100 },
          { unitName: "Retail Box (10 Pcs)", qty: 10, price: 19800 },
          { unitName: "Master Carton (20 Pcs)", qty: 20, price: 37500 },
        ],
      },
    ],
  },
  {
    _id: "P19",
    name: "Ring Light",
    category: "Accessories",
    sku: "RNG-19",
    brand: "StudioGlow",
    price: 450,
    stock: 7, // Needs Restock!
    minStock: 20,
    branch: "Tirupur",
    description: "Dimmable LED ring lamp with tripod stand for video creator setups.",
    variants: [
      {
        typeName: "10-Inch with Desktop Tripod",
        units: [
          { unitName: "Single Unit (1 Pc)", qty: 1, price: 450 },
          { unitName: "Box of 10 Units", qty: 10, price: 4100 },
          { unitName: "Carton of 30 Units", qty: 30, price: 11500 },
        ],
      },
      {
        typeName: "18-Inch RGB with 7ft Stand",
        units: [
          { unitName: "Single Unit (1 Pc)", qty: 1, price: 1450 },
          { unitName: "Box of 6 Units", qty: 6, price: 8200 },
          { unitName: "Carton of 15 Units", qty: 15, price: 19500 },
        ],
      },
    ],
  },
  {
    _id: "P20",
    name: "Tripod Stand",
    category: "Accessories",
    sku: "TRP-20",
    brand: "ProStand",
    price: 380,
    stock: 9, // Needs Restock!
    minStock: 25,
    branch: "Coimbatore",
    description: "Adjustable 7-foot aluminum photography stand with 360 ball head.",
    variants: [
      {
        typeName: "7-Foot Lightweight Aluminum",
        units: [
          { unitName: "Single Unit (1 Pc)", qty: 1, price: 380 },
          { unitName: "Box of 10 Units", qty: 10, price: 3500 },
          { unitName: "Carton of 40 Units", qty: 40, price: 13000 },
        ],
      },
      {
        typeName: "Flexible Gorilla Mobile Grip",
        units: [
          { unitName: "Single Unit (1 Pc)", qty: 1, price: 210 },
          { unitName: "Box of 10 Units", qty: 10, price: 1900 },
          { unitName: "Carton of 50 Units", qty: 50, price: 9000 },
        ],
      },
    ],
  },
  {
    _id: "P21",
    name: "Webcam",
    category: "Computer Gadgets",
    sku: "CAM-21",
    brand: "VisionHD",
    price: 680,
    stock: 15, // Needs Restock!
    minStock: 25,
    branch: "Tirupur",
    description: "Full HD 1080p computer web camera with integrated noise filter microphone.",
    variants: [
      {
        typeName: "1080p 30FPS with Privacy Shutter",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 680 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 6300 },
          { unitName: "Carton of 40 Pcs", qty: 40, price: 23500 },
        ],
      },
      {
        typeName: "2K Quad HD Auto Focus",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1450 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 13500 },
          { unitName: "Carton of 40 Pcs", qty: 40, price: 51000 },
        ],
      },
    ],
  },
  {
    _id: "P22",
    name: "HDMI Cable",
    category: "Cables",
    sku: "CBL-22",
    brand: "CableCraft",
    price: 130,
    stock: 140,
    minStock: 40,
    branch: "Coimbatore",
    description: "High speed 4K 60Hz gold-plated HDMI video audio display cable.",
    variants: [
      {
        typeName: "1.5-Meter 4K Braided",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 130 },
          { unitName: "Pack of 20 Pcs", qty: 20, price: 2300 },
          { unitName: "Master Carton (100 Pcs)", qty: 100, price: 10500 },
        ],
      },
      {
        typeName: "3-Meter 8K HDMI 2.1",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 280 },
          { unitName: "Pack of 20 Pcs", qty: 20, price: 5000 },
          { unitName: "Master Carton (100 Pcs)", qty: 100, price: 23000 },
        ],
      },
    ],
  },
  {
    _id: "P23",
    name: "Aux Cable",
    category: "Cables",
    sku: "CBL-23",
    brand: "CableCraft",
    price: 45,
    stock: 260,
    minStock: 50,
    branch: "Tirupur",
    description: "3.5mm male to male stereo auxiliary sound patch cable.",
    variants: [
      {
        typeName: "1-Meter Metal Jack 3.5mm",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 45 },
          { unitName: "Pack of 50 Pcs", qty: 50, price: 1800 },
          { unitName: "Master Carton (500 Pcs)", qty: 500, price: 15500 },
        ],
      },
      {
        typeName: "Type-C to 3.5mm DAC Adapter",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 95 },
          { unitName: "Pack of 50 Pcs", qty: 50, price: 4200 },
          { unitName: "Master Carton (500 Pcs)", qty: 500, price: 38000 },
        ],
      },
    ],
  },
  {
    _id: "P24",
    name: "Microphone",
    category: "Audio",
    sku: "MIC-24",
    brand: "VoicePro",
    price: 490,
    stock: 6, // Needs Restock!
    minStock: 20,
    branch: "Coimbatore",
    description: "Wireless collar clip-on lavalier mic with noise reduction for phones.",
    variants: [
      {
        typeName: "Wireless Collar Mic Single",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 490 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 4500 },
          { unitName: "Carton of 50 Pcs", qty: 50, price: 21000 },
        ],
      },
      {
        typeName: "Dual Wireless Mic Set with Case",
        units: [
          { unitName: "Single Set (1 Set)", qty: 1, price: 950 },
          { unitName: "Box of 10 Sets", qty: 10, price: 8800 },
          { unitName: "Carton of 40 Sets", qty: 40, price: 33500 },
        ],
      },
    ],
  },
  {
    _id: "P25",
    name: "Tablet Stand",
    category: "Accessories",
    sku: "STD-25",
    brand: "ProStand",
    price: 190,
    stock: 12, // Needs Restock!
    minStock: 30,
    branch: "Tirupur",
    description: "Foldable aluminum desktop cradle holder for mobile and iPad tablets.",
    variants: [
      {
        typeName: "Foldable Pocket Metal Stand",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 190 },
          { unitName: "Box of 20 Pcs", qty: 20, price: 3400 },
          { unitName: "Master Carton (100 Pcs)", qty: 100, price: 15500 },
        ],
      },
      {
        typeName: "360° Rotating Heavy Base Desk Stand",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 450 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 4100 },
          { unitName: "Master Carton (50 Pcs)", qty: 50, price: 19000 },
        ],
      },
    ],
  },
  {
    _id: "P26",
    name: "Network Switch",
    category: "Networking",
    sku: "SWT-26",
    brand: "NetWave",
    price: 850,
    stock: 10, // Needs Restock!
    minStock: 25,
    branch: "Coimbatore",
    description: "High performance Ethernet network switch with metal casing.",
    variants: [
      {
        typeName: "5-Port Fast Ethernet 10/100",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 550 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 5000 },
          { unitName: "Carton of 40 Pcs", qty: 40, price: 19000 },
        ],
      },
      {
        typeName: "8-Port Gigabit Enterprise Metal",
        units: [
          { unitName: "Single Piece (1 Pc)", qty: 1, price: 1650 },
          { unitName: "Box of 10 Pcs", qty: 10, price: 15500 },
          { unitName: "Carton of 30 Pcs", qty: 30, price: 44000 },
        ],
      },
    ],
  },
];

export const mockSummary = {
  totalRevenue: 38450000,
  totalProfit: 11250000,
  totalSales: 18450,
  totalCustomers: 420,
  totalProducts: 26,
  totalInventory: 14500,
  totalBranches: 2,
  totalEmployees: 32,
};

export const mockSalesWidgets = {
  today: 284500,
  weekly: 1640000,
  monthly: 6850000,
  yearly: 38450000,
};

export const mockMonthlyChart = [
  { _id: { month: 1 }, totalRevenue: 2450000, totalProfit: 720000, totalSales: 1180 },
  { _id: { month: 2 }, totalRevenue: 2800000, totalProfit: 810000, totalSales: 1320 },
  { _id: { month: 3 }, totalRevenue: 3150000, totalProfit: 940000, totalSales: 1490 },
  { _id: { month: 4 }, totalRevenue: 2900000, totalProfit: 860000, totalSales: 1380 },
  { _id: { month: 5 }, totalRevenue: 3450000, totalProfit: 1050000, totalSales: 1620 },
  { _id: { month: 6 }, totalRevenue: 3600000, totalProfit: 1120000, totalSales: 1740 },
  { _id: { month: 7 }, totalRevenue: 3950000, totalProfit: 1220000, totalSales: 1880 },
  { _id: { month: 8 }, totalRevenue: 3700000, totalProfit: 1140000, totalSales: 1760 },
  { _id: { month: 9 }, totalRevenue: 4100000, totalProfit: 1290000, totalSales: 1950 },
  { _id: { month: 10 }, totalRevenue: 4650000, totalProfit: 1420000, totalSales: 2240 },
  { _id: { month: 11 }, totalRevenue: 4950000, totalProfit: 1540000, totalSales: 2410 },
  { _id: { month: 12 }, totalRevenue: 5450000, totalProfit: 1680000, totalSales: 2660 },
];

export const mockTopProducts = [
  { _id: "1", productName: "Fast Charger", category: "Chargers", totalRevenue: 9850000, totalSold: 4800, revenue: 9850000 },
  { _id: "2", productName: "Power Bank", category: "Power Banks", totalRevenue: 8440000, totalSold: 2880, revenue: 8440000 },
  { _id: "3", productName: "Wireless Earbuds", category: "Audio", totalRevenue: 7120000, totalSold: 3150, revenue: 7120000 },
  { _id: "4", productName: "Smart Watch", category: "Wearables", totalRevenue: 5980000, totalSold: 2140, revenue: 5980000 },
  { _id: "5", productName: "Wi-Fi Router", category: "Networking", totalRevenue: 4890000, totalSold: 1200, revenue: 4890000 },
  { _id: "6", productName: "CCTV Camera", category: "Surveillance", totalRevenue: 4450000, totalSold: 1180, revenue: 4450000 },
  { _id: "7", productName: "Type-C Cable", category: "Cables", totalRevenue: 3920000, totalSold: 6440, revenue: 3920000 },
];

export const mockLowStock = mockProducts
  .filter((p) => p.stock <= (p.minStock || 20))
  .map((p) => ({
    _id: p._id,
    productName: p.name,
    sku: p.sku,
    quantity: p.stock,
    stock: p.stock,
    category: p.category,
    branch: p.branch,
  }));

export const mockRecentSales = [
  { _id: "S101", customerName: "Sri Murugan Mobiles Wholesale", productName: "Fast Charger (Master Carton)", totalAmount: 52000, quantity: 50, paymentMethod: "UPI", status: "completed", branch: "Coimbatore", createdAt: new Date().toISOString() },
  { _id: "S102", customerName: "Kongu Electronics Hub", productName: "Wi-Fi Router (Wholesale Pack)", totalAmount: 36000, quantity: 10, paymentMethod: "Net Banking", status: "completed", branch: "Tirupur", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "S103", customerName: "Kovai Gadget World", productName: "Power Bank (Carton of 40)", totalAmount: 30000, quantity: 40, paymentMethod: "UPI", status: "completed", branch: "Coimbatore", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "S104", customerName: "Tirupur Tech Bazaar", productName: "Wireless Earbuds (Carton 50)", totalAmount: 33000, quantity: 50, paymentMethod: "Card", status: "completed", branch: "Tirupur", createdAt: new Date(Date.now() - 14400000).toISOString() },
  { _id: "S105", customerName: "Avinashi Road Mobile Point", productName: "Smart Watch (Master Carton)", totalAmount: 60000, quantity: 50, paymentMethod: "Cash", status: "completed", branch: "Tirupur", createdAt: new Date(Date.now() - 28800000).toISOString() },
  { _id: "S106", customerName: "Gandhipuram Digital Plaza", productName: "CCTV Camera (Carton of 30)", totalAmount: 58000, quantity: 30, paymentMethod: "UPI", status: "completed", branch: "Coimbatore", createdAt: new Date(Date.now() - 43200000).toISOString() },
  { _id: "S107", customerName: "Palladam Mobile Care", productName: "Keypad Phone (Master Carton 50)", totalAmount: 42500, quantity: 50, paymentMethod: "Cash", status: "completed", branch: "Tirupur", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "S108", customerName: "RS Puram Cellular Mart", productName: "Type-C Cable (Carton 200 Pcs)", totalAmount: 14000, quantity: 200, paymentMethod: "Net Banking", status: "completed", branch: "Coimbatore", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "S109", customerName: "Singanallur Telecom Dealers", productName: "Wireless Neckband (100 Pcs)", totalAmount: 42000, quantity: 100, paymentMethod: "UPI", status: "completed", branch: "Coimbatore", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { _id: "S110", customerName: "Kumaran Road Tech Point", productName: "Bluetooth Speaker (Carton 30)", totalAmount: 33500, quantity: 30, paymentMethod: "Net Banking", status: "completed", branch: "Tirupur", createdAt: new Date(Date.now() - 345600000).toISOString() },
];

export const mockCustomers = [
  { _id: "C01", name: "Sri Murugan Mobiles Wholesale", email: "orders@muruganmobiles.com", phone: "+91 98422 10001", city: "Coimbatore", branch: "Coimbatore", loyaltyPoints: 850, totalSpent: 480000, address: "10th Street, Cross Cut Road, Gandhipuram, Coimbatore" },
  { _id: "C02", name: "Kongu Electronics & Gadgets", email: "kongugadgets@gmail.com", phone: "+91 98422 10002", city: "Tirupur", branch: "Tirupur", loyaltyPoints: 720, totalSpent: 395000, address: "Dharapuram Main Road, Tirupur" },
  { _id: "C03", name: "Kovai Digital Hub Distributors", email: "kovaidigital@rediffmail.com", phone: "+91 98422 10003", city: "Coimbatore", branch: "Coimbatore", loyaltyPoints: 940, totalSpent: 620000, address: "DB Road, RS Puram, Coimbatore" },
  { _id: "C04", name: "Tirupur Tech Bazaar Retailers", email: "tirupurbazaar@yahoo.com", phone: "+91 98422 10004", city: "Tirupur", branch: "Tirupur", loyaltyPoints: 610, totalSpent: 310000, address: "Kumaran Road, Near Railway Station, Tirupur" },
  { _id: "C05", name: "Avinashi Road Mobile Point", email: "avinashipoint@gmail.com", phone: "+91 98422 10005", city: "Tirupur", branch: "Tirupur", loyaltyPoints: 580, totalSpent: 285000, address: "Avinashi Road, Pushpa Theatre Corner, Tirupur" },
  { _id: "C06", name: "Gandhipuram Cellular Plaza", email: "gandhipuramplaza@outlook.com", phone: "+91 98422 10006", city: "Coimbatore", branch: "Coimbatore", loyaltyPoints: 890, totalSpent: 540000, address: "5th Street, Gandhipuram, Coimbatore" },
  { _id: "C07", name: "Palladam Mobile Care Wholesale", email: "palladamcare@gmail.com", phone: "+91 98422 10007", city: "Tirupur", branch: "Tirupur", loyaltyPoints: 490, totalSpent: 230000, address: "Trichy Road, Palladam, Tirupur Dist" },
  { _id: "C08", name: "Singanallur Telecom Dealers", email: "singanallurtelecom@gmail.com", phone: "+91 98422 10008", city: "Coimbatore", branch: "Coimbatore", loyaltyPoints: 670, totalSpent: 360000, address: "Trichy Road, Singanallur, Coimbatore" },
];

export const mockEmployees = [
  { _id: "E01", name: "A. Mahesh Kannan", email: "mahesh.k@besttelecom.in", phone: "+91 98765 01001", department: "Wholesale Sales", designation: "Branch Sales Manager", branch: "Coimbatore", salary: 52000, monthlySales: 2450000, target: 2000000 },
  { _id: "E02", name: "S. Prakash Murthy", email: "prakash.m@besttelecom.in", phone: "+91 98765 01002", department: "Wholesale Sales", designation: "Branch Sales Manager", branch: "Tirupur", salary: 50000, monthlySales: 2180000, target: 2000000 },
  { _id: "E03", name: "N. Divya Natarajan", email: "divya.n@besttelecom.in", phone: "+91 98765 01003", department: "Inventory & Dispatch", designation: "Warehouse Supervisor", branch: "Coimbatore", salary: 38000, monthlySales: 1400000, target: 1200000 },
  { _id: "E04", name: "K. Saravanan Vel", email: "saravanan.v@besttelecom.in", phone: "+91 98765 01004", department: "Inventory & Dispatch", designation: "Warehouse Supervisor", branch: "Tirupur", salary: 36000, monthlySales: 1250000, target: 1200000 },
  { _id: "E05", name: "M. Suresh Kumar", email: "suresh.k@besttelecom.in", phone: "+91 98765 01005", department: "B2B Accounts", designation: "Billing Lead", branch: "Coimbatore", salary: 34000, monthlySales: 980000, target: 800000 },
  { _id: "E06", name: "P. Priya Dharshini", email: "priya.d@besttelecom.in", phone: "+91 98765 01006", department: "B2B Accounts", designation: "Billing Lead", branch: "Tirupur", salary: 34000, monthlySales: 920000, target: 800000 },
  { _id: "E07", name: "V. Aravind Swamy", email: "aravind.s@besttelecom.in", phone: "+91 98765 01007", department: "Customer Success", designation: "Wholesale Client Executive", branch: "Coimbatore", salary: 30000, monthlySales: 780000, target: 700000 },
  { _id: "E08", name: "R. Kannan Soundar", email: "kannan.s@besttelecom.in", phone: "+91 98765 01008", department: "Customer Success", designation: "Wholesale Client Executive", branch: "Tirupur", salary: 30000, monthlySales: 750000, target: 700000 },
];

export const mockSuppliers = [
  { _id: "SUP01", name: "Foxconn Electronics India Ltd", email: "b2bsupply@foxconn.in", phone: "+91 44 2855 0101", city: "Chennai", category: "Chargers & Phones", gstin: "33AAACF1234F1Z1", branch: "Coimbatore", address: "SIPCOT Hi-Tech SEZ, Sriperumbudur" },
  { _id: "SUP02", name: "OptiWave Fiber & Networking Systems", email: "orders@optiwave.com", phone: "+91 80 4122 0202", city: "Bangalore", category: "Routers & Switches", gstin: "29AABCO5678H1Z4", branch: "Coimbatore", address: "Electronic City Phase 1, Bangalore" },
  { _id: "SUP03", name: "VoltPro GaN Semiconductor Tech", email: "wholesale@voltpro.in", phone: "+91 22 2833 0303", city: "Mumbai", category: "Chargers & Power Banks", gstin: "27AABCV9012K1Z8", branch: "Tirupur", address: "MIDC Andheri East, Mumbai" },
  { _id: "SUP04", name: "Acoustix Sound Labs Electronics", email: "distribution@acoustix.io", phone: "+91 11 4988 0404", city: "New Delhi", category: "Earbuds & Speakers", gstin: "07AABCA3456P1Z3", branch: "Tirupur", address: "Okhla Industrial Area Phase 3, New Delhi" },
  { _id: "SUP05", name: "SecureVision Surveillance Tech", email: "cctvsupply@securevision.in", phone: "+91 40 6711 0505", city: "Hyderabad", category: "CCTV & Cameras", gstin: "36AABCS7890M1Z5", branch: "Coimbatore", address: "HITEC City, Hyderabad" },
  { _id: "SUP06", name: "SanFlash Memory India", email: "orders@sanflash.in", phone: "+91 80 2311 0606", city: "Bangalore", category: "Memory & Storage", gstin: "29AABCS8899N1Z2", branch: "Coimbatore", address: "Whitefield Tech Park, Bangalore" },
  { _id: "SUP07", name: "Chronos Wearable Tech", email: "b2b@chronoswatch.in", phone: "+91 22 4588 0707", city: "Mumbai", category: "Smart Watches", gstin: "27AABCC3344R1Z9", branch: "Tirupur", address: "Bandra Kurla Complex, Mumbai" },
];

export const mockPurchaseOrders = [
  { _id: "PO901", purchaseOrderNo: "PO-CBR-8491", supplier: { name: "VoltPro GaN Semiconductor" }, product: { name: "Fast Charger" }, quantity: 500, purchasePrice: 280, totalAmount: 140000, branch: "Coimbatore", status: "Received", createdAt: new Date(Date.now() - 432000000).toISOString() },
  { _id: "PO902", purchaseOrderNo: "PO-TPR-8492", supplier: { name: "VoltPro GaN Semiconductor" }, product: { name: "Power Bank" }, quantity: 300, purchasePrice: 720, totalAmount: 216000, branch: "Tirupur", status: "Received", createdAt: new Date(Date.now() - 345600000).toISOString() },
  { _id: "PO903", purchaseOrderNo: "PO-CBR-8493", supplier: { name: "Acoustix Sound Labs" }, product: { name: "Wireless Earbuds" }, quantity: 400, purchasePrice: 620, totalAmount: 248000, branch: "Coimbatore", status: "Ordered", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { _id: "PO904", purchaseOrderNo: "PO-TPR-8494", supplier: { name: "Chronos Wearable Tech" }, product: { name: "Smart Watch" }, quantity: 250, purchasePrice: 1150, totalAmount: 287500, branch: "Tirupur", status: "Ordered", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "PO905", purchaseOrderNo: "PO-CBR-8495", supplier: { name: "OptiWave Fiber Systems" }, product: { name: "Wi-Fi Router" }, quantity: 200, purchasePrice: 1200, totalAmount: 240000, branch: "Coimbatore", status: "Ordered", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "PO906", purchaseOrderNo: "PO-TPR-8496", supplier: { name: "SecureVision Surveillance" }, product: { name: "CCTV Camera" }, quantity: 150, purchasePrice: 1350, totalAmount: 202500, branch: "Tirupur", status: "Received", createdAt: new Date(Date.now() - 72000000).toISOString() },
  { _id: "PO907", purchaseOrderNo: "PO-CBR-8497", supplier: { name: "Foxconn Electronics India" }, product: { name: "Keypad Phone" }, quantity: 300, purchasePrice: 850, totalAmount: 255000, branch: "Coimbatore", status: "Ordered", createdAt: new Date(Date.now() - 48000000).toISOString() },
  { _id: "PO908", purchaseOrderNo: "PO-TPR-8498", supplier: { name: "Acoustix Sound Labs" }, product: { name: "Bluetooth Speaker" }, quantity: 200, purchasePrice: 680, totalAmount: 136000, branch: "Tirupur", status: "Received", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { _id: "PO909", purchaseOrderNo: "PO-CBR-8499", supplier: { name: "SanFlash Memory India" }, product: { name: "Memory Card" }, quantity: 1000, purchasePrice: 190, totalAmount: 190000, branch: "Coimbatore", status: "Received", createdAt: new Date(Date.now() - 24000000).toISOString() },
  { _id: "PO910", purchaseOrderNo: "PO-TPR-8500", supplier: { name: "VoltPro GaN Semiconductor" }, product: { name: "Car Charger" }, quantity: 350, purchasePrice: 210, totalAmount: 73500, branch: "Tirupur", status: "Ordered", createdAt: new Date().toISOString() },
];

// Incoming Shop / Retailer Orders with Live Stock Cross-Verification & Supply Status
export const mockShopOrders = [
  {
    _id: "ORD-701",
    orderNo: "ORD-CBR-501",
    shopName: "Sri Murugan Mobiles Wholesale",
    productName: "Fast Charger",
    productCode: "CHG-01",
    type: "65W GaN Triple Port",
    unit: "Master Carton (50 Pcs)",
    requestedQty: 50,
    availableStock: 8,
    status: "Shortage - Manufacturer Order Needed", // Stock insufficient
    fulfillmentStatus: "Awaiting Manufacturer Shipment",
    branch: "Coimbatore",
    amount: 52000,
    mfrPoNo: "PO-CBR-8491",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ORD-702",
    orderNo: "ORD-TPR-502",
    shopName: "Kongu Electronics & Gadgets",
    productName: "Type-C Cable",
    productCode: "CBL-06",
    type: "100W 2-Meter Fast PD",
    unit: "Carton of 100 Pcs",
    requestedQty: 100,
    availableStock: 350,
    status: "Sufficient Stock - Delivered", // Stock available
    fulfillmentStatus: "Delivered & Invoiced",
    branch: "Tirupur",
    amount: 15000,
    mfrPoNo: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "ORD-703",
    orderNo: "ORD-CBR-503",
    shopName: "Kovai Digital Hub Distributors",
    productName: "Power Bank",
    productCode: "PBK-02",
    type: "20,000 mAh 22.5W Fast",
    unit: "Master Carton (30 Pcs)",
    requestedQty: 30,
    availableStock: 12,
    status: "Shortage - Manufacturer Order Needed",
    fulfillmentStatus: "PO Placed with VoltPro GaN",
    branch: "Coimbatore",
    amount: 37500,
    mfrPoNo: "PO-TPR-8492",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: "ORD-704",
    orderNo: "ORD-TPR-504",
    shopName: "Tirupur Tech Bazaar Retailers",
    productName: "Memory Card",
    productCode: "MEM-12",
    type: "64GB U3 4K Ready",
    unit: "Card Pack (25 Pcs)",
    requestedQty: 25,
    availableStock: 180,
    status: "Sufficient Stock - Delivered",
    fulfillmentStatus: "Delivered & Invoiced",
    branch: "Tirupur",
    amount: 8750,
    mfrPoNo: null,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    _id: "ORD-705",
    orderNo: "ORD-CBR-505",
    shopName: "Gandhipuram Cellular Plaza",
    productName: "Wireless Earbuds",
    productCode: "EAR-03",
    type: "ANC 32dB Noise Canceling",
    unit: "Master Carton (50 Pcs)",
    requestedQty: 50,
    availableStock: 5,
    status: "Shortage - Manufacturer Order Needed",
    fulfillmentStatus: "PO Placed with Acoustix Labs",
    branch: "Coimbatore",
    amount: 82000,
    mfrPoNo: "PO-CBR-8493",
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    _id: "ORD-706",
    orderNo: "ORD-TPR-506",
    shopName: "Avinashi Road Mobile Point",
    productName: "Phone Case",
    productCode: "CSE-15",
    type: "Magnetic MagSafe Matte Case",
    unit: "Pack of 50 Pcs",
    requestedQty: 50,
    availableStock: 310,
    status: "Sufficient Stock - Delivered",
    fulfillmentStatus: "Delivered & Invoiced",
    branch: "Tirupur",
    amount: 5200,
    mfrPoNo: null,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const mockNotifications = [
  { _id: "N1", title: "🚨 Restock Required: 15 Gadget Lines", message: "Fast Chargers, Power Banks, Earbuds & Smart Watches have reached critical low threshold in warehouses.", type: "low_stock", isRead: false, branch: "all", createdAt: new Date().toISOString() },
  { _id: "N2", title: "Bulk PO Created: PO-CBR-8500", message: "Purchase Order for 500 units of Fast Chargers sent to VoltPro GaN Tech.", type: "info", isRead: false, branch: "Coimbatore", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "N3", title: "Tirupur Branch Milestone", message: "Tirupur Hub dispatched 1,200 carton units this week (+24% growth).", type: "success", isRead: false, branch: "Tirupur", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "N4", title: "Cross-Branch Stock Telemetry", message: "Coimbatore & Tirupur wholesale stock sync completed across 26 electronic lines.", type: "info", isRead: true, branch: "all", createdAt: new Date(Date.now() - 86400000).toISOString() },
];
