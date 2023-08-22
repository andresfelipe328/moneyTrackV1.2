import categories from './categories.json'

import {BsBank2} from 'react-icons/bs'
import {BiTransfer, BiCameraMovie} from 'react-icons/bi'
import {RiCommunityFill} from 'react-icons/ri'
import {MdFastfood, MdOutlinePayment, MdOutlineHomeRepairService} from 'react-icons/md'
import {FaHospitalAlt, FaPlaneDeparture} from 'react-icons/fa'
import {AiFillShopping} from 'react-icons/ai'
import {IoSchool} from 'react-icons/io5'


const mainCategoryIcons = [
   {
      name: 'Bank Fees',
      icon: BsBank2
   },
   {
      name: 'Community',
      icon: RiCommunityFill
   },
   {
      name: 'Food and Drink',
      icon: MdFastfood
   },
   {
      name: 'Education',
      icon: IoSchool
   },
   {
      name: 'Healthcare',
      icon: FaHospitalAlt
   },
   {
      name: 'Payment',
      icon: MdOutlinePayment
   },
   {
      name: 'Recreation',
      icon: BiCameraMovie
   },
   {
      name: 'Service',
      icon: MdOutlineHomeRepairService
   },
   {
      name: 'Shops',
      icon: AiFillShopping
   },
   {
      name: 'Transfer',
      icon: BiTransfer
   },
   {
      name: 'Travel',
      icon: FaPlaneDeparture
   },
]

export default mainCategoryIcons