export const FORM_SECTIONS = [
  {
    id: 'policy',
    title: 'Policy Details',
    icon: 'FileText',
    fields: [
      {
        name: 'PolicyType', label: 'Policy Type', type: 'select',
        options: [
          'Sedan - Liability', 'Sedan - Collision', 'Sedan - All Perils',
          'Sport - Liability', 'Sport - Collision', 'Sport - All Perils',
          'Utility - Liability', 'Utility - Collision', 'Utility - All Perils',
        ],
      },
      { name: 'BasePolicy', label: 'Base Policy', type: 'select', options: ['Liability', 'Collision', 'All Perils'] },
      { name: 'Deductible', label: 'Deductible ($)', type: 'number', placeholder: '400', min: 100, max: 2000 },
      { name: 'AgentType',  label: 'Agent Type',    type: 'select', options: ['External', 'Internal'] },
    ],
  },
  {
    id: 'claimant',
    title: 'Claimant Information',
    icon: 'User',
    fields: [
      { name: 'Age',               label: 'Driver Age',              type: 'number', placeholder: '38', min: 16, max: 100 },
      { name: 'Sex',               label: 'Gender',                  type: 'select', options: ['Male', 'Female'] },
      { name: 'MaritalStatus',     label: 'Marital Status',          type: 'select', options: ['Single', 'Married', 'Divorced', 'Widow'] },
      {
        name: 'AgeOfPolicyHolder', label: 'Policy Holder Age Group', type: 'select',
        options: ['16 to 17', '18 to 20', '21 to 25', '26 to 30', '31 to 35', '36 to 40', '41 to 50', '51 to 65', 'over 65'],
      },
      { name: 'Fault', label: 'Fault', type: 'select', options: ['Policy Holder', 'Third Party'] },
    ],
  },
  {
    id: 'vehicle',
    title: 'Vehicle Details',
    icon: 'Car',
    fields: [
      {
        name: 'Make', label: 'Vehicle Make', type: 'select',
        options: [
          'Honda', 'Toyota', 'Ford', 'Mazda', 'Chevrolet', 'Pontiac', 'Accura', 'Dodge',
          'Mercury', 'Jaguar', 'Nisson', 'VW', 'Saab', 'Saturn', 'Porche', 'BMW', 'Mecedes', 'Ferrari', 'Lexus',
        ],
      },
      { name: 'VehicleCategory', label: 'Vehicle Category',    type: 'select', options: ['Sedan', 'Sport', 'Utility'] },
      {
        name: 'VehiclePrice', label: 'Vehicle Price Range', type: 'select',
        options: ['less than 20000', '20000 to 29000', '30000 to 39000', '40000 to 59000', '60000 to 69000', 'more than 69000'],
      },
      {
        name: 'AgeOfVehicle', label: 'Age of Vehicle', type: 'select',
        options: ['new', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', 'more than 7'],
      },
      {
        name: 'NumberOfCars', label: 'Number of Cars Insured', type: 'select',
        options: ['1 vehicle', '2 vehicles', '3 to 4', '5 to 8', 'more than 8'],
      },
      { name: 'AccidentArea', label: 'Accident Area', type: 'select', options: ['Urban', 'Rural'] },
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence & Timeline',
    icon: 'Shield',
    fields: [
      { name: 'PoliceReportFiled', label: 'Police Report Filed',       type: 'select', options: ['No', 'Yes'] },
      { name: 'WitnessPresent',    label: 'Witness Present',           type: 'select', options: ['No', 'Yes'] },
      {
        name: 'Days_Policy_Accident', label: 'Days: Policy → Accident', type: 'select',
        options: ['none', '1 to 7', '8 to 15', '15 to 30', 'more than 30'],
      },
      {
        name: 'Days_Policy_Claim', label: 'Days: Policy → Claim', type: 'select',
        options: ['none', '8 to 15', '15 to 30', 'more than 30'],
      },
      {
        name: 'PastNumberOfClaims', label: 'Past Number of Claims', type: 'select',
        options: ['none', '1', '2 to 4', 'more than 4'],
      },
      {
        name: 'NumberOfSuppliments', label: 'Number of Supplements', type: 'select',
        options: ['none', '1 to 2', '3 to 5', 'more than 5'],
      },
      {
        name: 'AddressChange_Claim', label: 'Address Change Near Claim', type: 'select',
        options: ['no change', 'under 6 months', '1 year', '2 to 3 years', '4 to 8 years'],
      },
    ],
  },
]

export const DEFAULT_VALUES = {
  PolicyType: 'Sedan - Collision',  BasePolicy: 'Collision',
  Deductible: 500,                  AgentType: 'Internal',
  Age: 45,          Sex: 'Female',  MaritalStatus: 'Married',
  AgeOfPolicyHolder: '41 to 50',    Fault: 'Policy Holder',
  Make: 'Honda',    VehicleCategory: 'Sedan',
  VehiclePrice: '20000 to 29000',   AgeOfVehicle: '5 years',
  NumberOfCars: '2 vehicles',       AccidentArea: 'Urban',
  PoliceReportFiled: 'Yes',         WitnessPresent: 'Yes',
  Days_Policy_Accident: 'more than 30',
  Days_Policy_Claim:    'more than 30',
  PastNumberOfClaims:   'none',
  NumberOfSuppliments:  'none',
  AddressChange_Claim:  'no change',
}

export const HIGH_RISK_PRESET = {
  PolicyType: 'Sport - Liability',  BasePolicy: 'Liability',
  Deductible: 300,                  AgentType: 'External',
  Age: 21,          Sex: 'Male',    MaritalStatus: 'Single',
  AgeOfPolicyHolder: '21 to 25',    Fault: 'Third Party',
  Make: 'BMW',      VehicleCategory: 'Sport',
  VehiclePrice: 'more than 69000',  AgeOfVehicle: 'new',
  NumberOfCars: '1 vehicle',        AccidentArea: 'Rural',
  PoliceReportFiled: 'No',          WitnessPresent: 'No',
  Days_Policy_Accident: '1 to 7',
  Days_Policy_Claim:    '8 to 15',
  PastNumberOfClaims:   'more than 4',
  NumberOfSuppliments:  'more than 5',
  AddressChange_Claim:  'under 6 months',
}