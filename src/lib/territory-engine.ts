import { firestore } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { getAgentRadiusConfig } from './config-engine';

/**
 * Senior Architect Utility: Territory Management Engine
 * Manages agent operating radius and locality restrictions.
 */

/**
 * Validates if a property is within an agent's allowed territory.
 * Checks against radius, city restrictions, and area restrictions.
 */
export const isPropertyInAgentTerritory = async (
  agentId: string, 
  propertyCity: string, 
  propertyLocality: string,
  agentLat: number,
  agentLng: number,
  propertyLat: number,
  propertyLng: number,
  agentPackage: string
): Promise<{ allowed: boolean; reason?: string }> => {
  // 1. Fetch Platform Radius Configuration
  const config = await getAgentRadiusConfig();
  if (!config) return { allowed: true }; // Default to allowed if no config

  // 2. Check Premium Override
  if (config.premiumOverride && agentPackage === 'Platinum') {
    return { allowed: true };
  }

  // 3. Check City Restrictions
  if (config.cityRestrictions.length > 0) {
    const isCityAllowed = config.cityRestrictions.some(
      city => city.toLowerCase() === propertyCity.toLowerCase()
    );
    if (!isCityAllowed) {
      return { allowed: false, reason: `Platform does not operate in ${propertyCity}` };
    }
  }

  // 4. Check Area/Locality Restrictions
  if (config.areaRestrictions.length > 0) {
    const isAreaRestricted = config.areaRestrictions.some(
      area => area.toLowerCase() === propertyLocality.toLowerCase()
    );
    if (isAreaRestricted) {
      return { allowed: false, reason: `Locality ${propertyLocality} is restricted` };
    }
  }

  // 5. Check Radius Limit
  const distance = calculateDistance(agentLat, agentLng, propertyLat, propertyLng);
  if (distance > config.radiusKm) {
    return { 
      allowed: false, 
      reason: `Property is ${distance.toFixed(1)}km away. Your limit is ${config.radiusKm}km.` 
    };
  }

  return { allowed: true };
};

/**
 * Haversine formula to calculate distance between two points in KM
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
