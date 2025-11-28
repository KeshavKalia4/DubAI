import { organizations } from './organizations'

const defaultOrg = organizations[0]
export const colors = {
    primary: {
        //UW Purple
        light: '#c4b5fd', // purple-300 (hover states)
        DEFAULT: defaultOrg.branding.primaryColor,
        dark: '#6b21a8'// purple-800 (darker hover)
    },
    secondary: {
        DEFAULT: defaultOrg.branding.secondaryColor,  // '#b7a57a' (UW Gold)
    }
}
export const badges = {
    event: {
        bg: 'bg-blue-100',
        text: 'text-blue-800'
    },
    club: {
        bg: 'bg-green-100',
        text: 'text-gray-800'
    },
    announcement: {
        bg: 'bg-gray-100',
        text: 'text-gray-800'
    },
}