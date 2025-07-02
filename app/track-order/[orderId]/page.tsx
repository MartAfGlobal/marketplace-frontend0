"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Menu, ShoppingCart, User, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader } from '@googlemaps/js-api-loader';

// Mock order tracking data
const orderData = {
  id: 'ORD-12345678',
  status: 'Processed',
  delivery: 'May 15, 2025',
  product: {
    title: 'Nike shoes with white an.',
    description: 'Two piece shop',
    specifications: '2PC, Black',
    price: '₦14,000',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
  },
  orderInfo: {
    placedDate: '02 February, 2025',
    estimatedDelivery: '12 March - 19 March, 2025',
    returnPeriod: '7 days after delivery'
  },
  customer: {
    fullName: 'FirstName LastName',
    email: 'FirstName@gmail.com',
    phone1: '+234 1234567890',
    phone2: '+234 1234567890'
  },
  addresses: {
    customer: 'No 23 You and Ibadan Street Express Road, Opposite Sam Stadium, Oshodi, Lagos State, Nigeria.',
    delivery: 'No 23 You and Ibadan Street Express Road, Opposite Sam Stadium, Oshodi, Lagos State, Nigeria.'
  },
  tracking: {
    currentLocation: { lat: 7.3775, lng: 3.9470 }, // Ibadan coordinates
    destination: { lat: 9.0579, lng: 7.4951 }, // Abuja coordinates
    processedDate: '03-Feb-2025',
    route: [
      { lat: 6.5244, lng: 3.3792 }, // Lagos
      { lat: 7.3775, lng: 3.9470 }, // Ibadan
      { lat: 8.4799, lng: 4.5418 }, // Ilorin
      { lat: 9.0579, lng: 7.4951 }  // Abuja
    ]
  }
};

export default function TrackOrderPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['geometry']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          // Create map centered on Nigeria
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 9.0579, lng: 7.4951 }, // Abuja center
            zoom: 6,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ color: '#f0f8f0' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#a8d4f0' }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          mapInstanceRef.current = map;

          // Create route polyline (Uber-style)
          const routePath = new google.maps.Polyline({
            path: orderData.tracking.route,
            geodesic: true,
            strokeColor: '#10B981',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: '#10B981',
                  fillColor: '#10B981',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  scale: 3
                },
                offset: '100%'
              }
            ]
          });

          routePath.setMap(map);

          // Origin marker (Lagos - starting point)
          new google.maps.Marker({
            position: orderData.tracking.route[0],
            map: map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10B981" stroke="#fff" stroke-width="4"/>
                  <circle cx="16" cy="16" r="6" fill="#fff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            },
            title: 'Package Origin - Lagos'
          });

          // Current location marker (delivery person)
          const currentLocationMarker = new google.maps.Marker({
            position: orderData.tracking.currentLocation,
            map: map,
            icon: {
              url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
              scaledSize: new google.maps.Size(48, 48),
              anchor: new google.maps.Point(24, 24)
            },
            title: 'Delivery Person - Current Location'
          });

          // Custom info window for current location
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: sans-serif;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${orderData.status}</div>
                <div style="font-size: 12px; color: #666;">${orderData.tracking.processedDate}</div>
              </div>
            `
          });

          currentLocationMarker.addListener('click', () => {
            infoWindow.open(map, currentLocationMarker);
          });

          // Destination marker (Abuja)
          new google.maps.Marker({
            position: orderData.tracking.destination,
            map: map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4 C 10 4, 6 8, 6 14 C 6 20, 16 28, 16 28 S 26 20, 26 14 C 26 8, 22 4, 16 4 Z" 
                        fill="#EF4444" stroke="#fff" stroke-width="2"/>
                  <circle cx="16" cy="14" r="4" fill="#fff"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 28)
            },
            title: 'Destination - Abuja'
          });

          // Fit map to show the route
          const bounds = new google.maps.LatLngBounds();
          orderData.tracking.route.forEach(point => bounds.extend(point));
          map.fitBounds(bounds);
          
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load map');
      }
    };

    initMap();
  }, []);

  const handleHelpCenter = () => {
    toast.info('Opening Help Center...');
  };

  const handleLiveChat = () => {
    toast.info('Starting Live Chat...');
  };

  const handleFAQs = () => {
    toast.info('Opening FAQs...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/account/orders">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-black">Track Order</h1>
        </div>
      </div>

      {/* Order ID and Status */}
      <div className="bg-white px-4 py-4">
        <h2 className="text-2xl font-bold text-black mb-2">{orderData.id}</h2>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-purple-600 font-medium">Order Status: </span>
            <span className="text-purple-600 font-bold">{orderData.status}</span>
          </div>
          <span className="text-gray-600">Delivery: {orderData.delivery}</span>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="px-4 py-4">
        <Card className="relative overflow-hidden">
          <div className="h-80 relative">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: '320px' }}
            />
            {!isMapLoaded && (
              <div className="absolute inset-0 bg-green-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Product Details */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-white">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={orderData.product.image}
                alt={orderData.product.title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-black mb-1">{orderData.product.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{orderData.product.description}</p>
              <p className="text-sm text-gray-500 mb-2">{orderData.product.specifications}</p>
              <p className="text-lg font-bold text-black">{orderData.product.price}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Information */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-black">Order Information</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Order Placed & Confirmed on:</p>
              <p className="font-medium text-black">{orderData.orderInfo.placedDate}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Estimated Delivery Date:</p>
              <p className="font-medium text-black">{orderData.orderInfo.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Return Period:</p>
              <p className="font-medium text-black">{orderData.orderInfo.returnPeriod}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Details */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6" />
            <h3 className="text-lg font-bold text-black">Customer Details</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Full Name:</p>
              <p className="font-medium text-black">{orderData.customer.fullName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email:</p>
              <p className="font-medium text-black">{orderData.customer.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Phone 1:</p>
                <p className="font-medium text-black">{orderData.customer.phone1}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone 2:</p>
                <p className="font-medium text-black">{orderData.customer.phone2}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Locations */}
      <div className="px-4 pb-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6" />
            <h3 className="text-lg font-bold text-black">Locations</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Customer Address:</p>
              <p className="font-medium text-black text-sm leading-relaxed">{orderData.addresses.customer}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Delivery Address:</p>
              <p className="font-medium text-black text-sm leading-relaxed">{orderData.addresses.delivery}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Support Links */}
      <div className="px-4 pb-8 space-y-1">
        <button 
          onClick={handleHelpCenter}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <span className="font-medium text-black">Help Center</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button 
          onClick={handleLiveChat}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <span className="font-medium text-black">Live Chat</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        
        <button 
          onClick={handleFAQs}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <span className="font-medium text-black">FAQs</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
} 