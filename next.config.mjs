import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images :{
        remotePatterns :[
            {
            hostname: 'links.papareact.com',
            protocol: 'https',
            },

            {
                hostname: 'm.media-amazon.com',
                protocol: 'https',
            },
            
            {
                hostname: 'lh3.googleusercontent.com',
                protocol: 'https',
            },

            {
                hostname: 'homes4india.com',
                protocol: 'https',
            },

            {
                hostname: 'images.squarespace-cdn.com' ,
                protocol: 'https',
            },

            {
                hostname: 'encrypted-tbn0.gstatic.com' ,
                protocol: "https" ,
            },

            {
                protocol: 'https',
                hostname: 'www.shutterstock.com',
            },

            {
                protocol: 'https',
                hostname: 'closerpets.co.uk',
            },

            {
                protocol: 'https',
                hostname: 'i.ebayimg.com',
            },
            {
                protocol: 'https',
                hostname: 'd1nymbkeomeoqg.cloudfront.net',
            }
        ],
        
    },env:{
        STRIPE_PUBLIC_KEY : process.env.STRIPE_PUBLIC_KEY
    }
};

export default nextConfig;
