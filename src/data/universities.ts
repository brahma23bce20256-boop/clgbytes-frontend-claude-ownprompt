export type UniversityId = 'vit-ap' | 'srm-ap' | 'amrita-ap'

export interface University {
  id: UniversityId
  name: string
  shortName: string
  city: string
  deliveryPartner: string
}

export const UNIVERSITIES: University[] = [
  {
    id: 'vit-ap',
    name: 'VIT-AP University',
    shortName: 'VIT-AP',
    city: 'Amaravati, Andhra Pradesh',
    deliveryPartner: '7842960252',
  },
  {
    id: 'srm-ap',
    name: 'SRM AP University',
    shortName: 'SRM AP',
    city: 'Amaravati, Andhra Pradesh',
    deliveryPartner: '9640917131',
  },
  {
    id: 'amrita-ap',
    name: 'Amrita AP University',
    shortName: 'Amrita AP',
    city: 'Amaravati, Andhra Pradesh',
    deliveryPartner: '7396018423',
  },
]

export const CONTACT = {
  email: 'clgbytes@gmail.com',
  phone: '7842960252',
}
