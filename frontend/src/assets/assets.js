import cross_icon from './cross_icon.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import profile_pic from './profile_pic.png'
import hero from './hero.png'
import arrow_icon from './arrow_icon.svg'
import stationary from './stationary.webp'
import gadgets from './gadgets.webp'
import room_essentials from './room_essentials.webp'
import clothing from './clothing.webp'
import transport from './transport.webp'
import appliances from './appliances.webp'
import games from './games.webp'
import accomodation from './accomodation.webp'
import others from './others.webp'
import calculator from './calculator.webp'
import earphone from './earphone.webp'
import lamp from './lamp.webp'
import shoes from './shoes.webp'
import bycycle from './bycycle.webp'
import electric_kettle from './Electric-kettle.webp'
import chess from './chess.webp'
import badminton from './badminton.webp'
import umbrella from './umbrella.webp'
import about_image from './about_image.jpg'

export const assets = {
  cross_icon,
  dropdown_icon,
  menu_icon,
  profile_pic,
  hero,
  arrow_icon,
  about_image
}

export const categoryData = [
  {
    category: "Stationary",
    image: stationary,
  },
  {
    category: "Gadgets",
    image: gadgets,
  },
  {
    category: "Room Essentials",
    image: room_essentials,
  },
  {
    category: "Clothing",
    image: clothing,
  },
  {
    category: "Transport",
    image: transport,
  },
  {
    category: "Appliances",
    image: appliances,
  },
  {
    category: "Games",
    image: games,
  },
  {
    category: "Accommodation",
    image: accomodation,
  },
  {
    category: "Others",
    image: others,
  },
] 

export const items = [
  {
    _id: "0000",
    name: "Scientific Calculator",
    catagory: "Stationary",
    price: 550,
    available: true,
    description: "Gently used scientific calculator, suitable for engineering students.",
    old: '1 Year',
    image: calculator
  },
  {
    _id: "0001",
    name: "Bluetooth Earphones",
    catagory: "Gadgets",
    price: 600,
    available: false,
    description: "Boat Noise-canceling earphones with great battery life.",
    old: '1 Year',
    image: earphone
  },  
  {
    _id: "0002",
    name: "LED Desk Lamp",
    catagory: "Room Essentials",
    price: 150,
    available: true,
    description: "Flexible LED lamp with brightness control.",
    old: '8 Months',
    image: lamp
  },
  {
    _id: "0003",
    name: "Running Shoes",
    catagory: "Clothing",
    price: 400,
    available: false,
    description: "Lightweight, breathable running shoes. Size 9.",
    old: '6 Months',
    image: shoes
  },
  {
    _id: "0004",
    name: "Bicycle",
    catagory: "Transport",
    price: 2500,
    available: true,
    description: "Gear bicycle in good condition, rarely used.",
    old: '2 Years',
    image: bycycle
  },
  {
    _id: "0005",
    name: "Electric Kettle",
    catagory: "Appliances",
    price: 200,
    available: true,
    description: "1.5L electric kettle, perfect for hostel use.",
    old: '1 Year',
    image: electric_kettle
  },
  {
    _id: "0006",
    name: "Chess Board",
    catagory: "Games",
    price: 50,
    available: true,
    description: "Wooden chess set with carved pieces.",
    old: '3 Years',
    image: chess
  },
  {
    _id: "0007",
    name: "Badminton Racket Set",
    catagory: "Games",
    price: 450,
    available: false,
    description: "2 rackets and a set of shuttlecocks in a carry case.",
    old: '1 Year',
    image: badminton
  },
  {
    _id: "0008",
    name: "Umbrella",
    catagory: "Others",
    price: 60,
    available: true,
    description: "Foldable umbrella in good condition.",
    old: '6 Months',
    image: umbrella
  }
]