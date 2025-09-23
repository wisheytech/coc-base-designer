// Core building interface (existing)
export interface Building {
  id: string;
  type: string;
  x: number;
  y: number;
  level: number;
  rotation?: number;
}

// Layout interface (existing)
export interface Layout {
  id: string;
  name: string;
  th_level: number;
  buildings: Building[];
  thumbnail_url?: string;
  user_id?: string;
  created_at?: string;
}

// User profile interface (existing)
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  current_th_level: number;
  subscription_tier: 'free' | 'pro' | 'creator';
  exports_used_this_month: number;
}

// Comprehensive COC Building System
export interface COCBuilding {
  id: string;
  type: 'defense' | 'resource' | 'army' | 'other' | 'decoration';
  name: string;
  category: string;
  maxLevels: number;
  availability: {
    [thLevel: number]: {
      unlocked: boolean;
      maxCount: number;
      maxLevel: number;
    };
  };
  size: { width: number; height: number };
  iconUrl?: string;
  description?: string;
}

export interface COCAssets {
  version: string;
  lastUpdated: string;
  buildings: COCBuilding[];
  townHalls: {
    [level: number]: {
      buildings: string[];
      maxBuildings: { [buildingId: string]: number };
    };
  };
}

// Complete COC Assets Database (TH1-17)
export const COC_ASSETS: COCAssets = {
  version: "2025.3",
  lastUpdated: "2025-09-14",
  buildings: [
    {
      id: "town_hall",
      type: "defense",
      name: "Town Hall",
      category: "core",
      maxLevels: 17,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 1 },
        2: { unlocked: true, maxCount: 1, maxLevel: 2 },
        3: { unlocked: true, maxCount: 1, maxLevel: 3 },
        4: { unlocked: true, maxCount: 1, maxLevel: 4 },
        5: { unlocked: true, maxCount: 1, maxLevel: 5 },
        6: { unlocked: true, maxCount: 1, maxLevel: 6 },
        7: { unlocked: true, maxCount: 1, maxLevel: 7 },
        8: { unlocked: true, maxCount: 1, maxLevel: 8 },
        9: { unlocked: true, maxCount: 1, maxLevel: 9 },
        10: { unlocked: true, maxCount: 1, maxLevel: 10 },
        11: { unlocked: true, maxCount: 1, maxLevel: 11 },
        12: { unlocked: true, maxCount: 1, maxLevel: 12 },
        13: { unlocked: true, maxCount: 1, maxLevel: 13 },
        14: { unlocked: true, maxCount: 1, maxLevel: 14 },
        15: { unlocked: true, maxCount: 1, maxLevel: 15 },
        16: { unlocked: true, maxCount: 1, maxLevel: 16 },
        17: { unlocked: true, maxCount: 1, maxLevel: 17 }
      },
      size: { width: 4, height: 4 }
    },
    {
      id: "cannon",
      type: "defense",
      name: "Cannon",
      category: "defense",
      maxLevels: 21,
      availability: {
        1: { unlocked: true, maxCount: 2, maxLevel: 5 },
        2: { unlocked: true, maxCount: 2, maxLevel: 5 },
        3: { unlocked: true, maxCount: 3, maxLevel: 8 },
        4: { unlocked: true, maxCount: 4, maxLevel: 10 },
        5: { unlocked: true, maxCount: 5, maxLevel: 12 },
        6: { unlocked: true, maxCount: 6, maxLevel: 12 },
        7: { unlocked: true, maxCount: 7, maxLevel: 14 },
        8: { unlocked: true, maxCount: 7, maxLevel: 14 },
        9: { unlocked: true, maxCount: 7, maxLevel: 16 },
        10: { unlocked: true, maxCount: 7, maxLevel: 16 },
        11: { unlocked: true, maxCount: 8, maxLevel: 18 },
        12: { unlocked: true, maxCount: 8, maxLevel: 18 },
        13: { unlocked: true, maxCount: 8, maxLevel: 19 },
        14: { unlocked: true, maxCount: 8, maxLevel: 20 },
        15: { unlocked: true, maxCount: 8, maxLevel: 21 },
        16: { unlocked: true, maxCount: 8, maxLevel: 21 },
        17: { unlocked: true, maxCount: 8, maxLevel: 21 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "archer_tower",
      type: "defense",
      name: "Archer Tower",
      category: "defense",
      maxLevels: 21,
      availability: {
        2: { unlocked: true, maxCount: 1, maxLevel: 5 },
        3: { unlocked: true, maxCount: 1, maxLevel: 8 },
        4: { unlocked: true, maxCount: 2, maxLevel: 10 },
        5: { unlocked: true, maxCount: 3, maxLevel: 12 },
        6: { unlocked: true, maxCount: 4, maxLevel: 12 },
        7: { unlocked: true, maxCount: 5, maxLevel: 14 },
        8: { unlocked: true, maxCount: 6, maxLevel: 14 },
        9: { unlocked: true, maxCount: 8, maxLevel: 16 },
        10: { unlocked: true, maxCount: 8, maxLevel: 16 },
        11: { unlocked: true, maxCount: 8, maxLevel: 18 },
        12: { unlocked: true, maxCount: 8, maxLevel: 18 },
        13: { unlocked: true, maxCount: 8, maxLevel: 19 },
        14: { unlocked: true, maxCount: 8, maxLevel: 20 },
        15: { unlocked: true, maxCount: 8, maxLevel: 21 },
        16: { unlocked: true, maxCount: 8, maxLevel: 21 },
        17: { unlocked: true, maxCount: 8, maxLevel: 21 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "mortar",
      type: "defense",
      name: "Mortar",
      category: "defense",
      maxLevels: 15,
      availability: {
        3: { unlocked: true, maxCount: 1, maxLevel: 5 },
        5: { unlocked: true, maxCount: 2, maxLevel: 8 },
        7: { unlocked: true, maxCount: 3, maxLevel: 10 },
        8: { unlocked: true, maxCount: 4, maxLevel: 12 },
        9: { unlocked: true, maxCount: 4, maxLevel: 13 },
        10: { unlocked: true, maxCount: 4, maxLevel: 13 },
        11: { unlocked: true, maxCount: 4, maxLevel: 14 },
        12: { unlocked: true, maxCount: 4, maxLevel: 14 },
        13: { unlocked: true, maxCount: 4, maxLevel: 15 },
        14: { unlocked: true, maxCount: 4, maxLevel: 15 },
        15: { unlocked: true, maxCount: 4, maxLevel: 15 },
        16: { unlocked: true, maxCount: 4, maxLevel: 15 },
        17: { unlocked: true, maxCount: 4, maxLevel: 15 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "wizard_tower",
      type: "defense",
      name: "Wizard Tower",
      category: "defense",
      maxLevels: 16,
      availability: {
        5: { unlocked: true, maxCount: 1, maxLevel: 6 },
        7: { unlocked: true, maxCount: 2, maxLevel: 8 },
        8: { unlocked: true, maxCount: 3, maxLevel: 10 },
        9: { unlocked: true, maxCount: 4, maxLevel: 11 },
        10: { unlocked: true, maxCount: 4, maxLevel: 12 },
        11: { unlocked: true, maxCount: 4, maxLevel: 13 },
        12: { unlocked: true, maxCount: 4, maxLevel: 14 },
        13: { unlocked: true, maxCount: 4, maxLevel: 15 },
        14: { unlocked: true, maxCount: 4, maxLevel: 15 },
        15: { unlocked: true, maxCount: 4, maxLevel: 16 },
        16: { unlocked: true, maxCount: 4, maxLevel: 16 },
        17: { unlocked: true, maxCount: 4, maxLevel: 16 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "tesla",
      type: "defense",
      name: "Hidden Tesla",
      category: "defense",
      maxLevels: 13,
      availability: {
        7: { unlocked: true, maxCount: 2, maxLevel: 6 },
        8: { unlocked: true, maxCount: 3, maxLevel: 8 },
        9: { unlocked: true, maxCount: 4, maxLevel: 9 },
        10: { unlocked: true, maxCount: 4, maxLevel: 10 },
        11: { unlocked: true, maxCount: 4, maxLevel: 11 },
        12: { unlocked: true, maxCount: 4, maxLevel: 12 },
        13: { unlocked: true, maxCount: 4, maxLevel: 13 },
        14: { unlocked: true, maxCount: 4, maxLevel: 13 },
        15: { unlocked: true, maxCount: 4, maxLevel: 13 },
        16: { unlocked: true, maxCount: 4, maxLevel: 13 },
        17: { unlocked: true, maxCount: 4, maxLevel: 13 }
      },
      size: { width: 2, height: 2 }
    },
    {
      id: "air_defense",
      type: "defense",
      name: "Air Defense",
      category: "defense",
      maxLevels: 12,
      availability: {
        4: { unlocked: true, maxCount: 1, maxLevel: 4 },
        6: { unlocked: true, maxCount: 2, maxLevel: 6 },
        7: { unlocked: true, maxCount: 3, maxLevel: 7 },
        8: { unlocked: true, maxCount: 4, maxLevel: 8 },
        9: { unlocked: true, maxCount: 4, maxLevel: 9 },
        10: { unlocked: true, maxCount: 4, maxLevel: 10 },
        11: { unlocked: true, maxCount: 4, maxLevel: 10 },
        12: { unlocked: true, maxCount: 4, maxLevel: 11 },
        13: { unlocked: true, maxCount: 4, maxLevel: 11 },
        14: { unlocked: true, maxCount: 4, maxLevel: 12 },
        15: { unlocked: true, maxCount: 4, maxLevel: 12 },
        16: { unlocked: true, maxCount: 4, maxLevel: 12 },
        17: { unlocked: true, maxCount: 4, maxLevel: 12 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "gold_mine",
      type: "resource",
      name: "Gold Mine",
      category: "resource",
      maxLevels: 16,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 3 },
        2: { unlocked: true, maxCount: 2, maxLevel: 5 },
        3: { unlocked: true, maxCount: 3, maxLevel: 7 },
        4: { unlocked: true, maxCount: 4, maxLevel: 8 },
        5: { unlocked: true, maxCount: 5, maxLevel: 10 },
        6: { unlocked: true, maxCount: 6, maxLevel: 12 },
        7: { unlocked: true, maxCount: 6, maxLevel: 12 },
        8: { unlocked: true, maxCount: 6, maxLevel: 12 },
        9: { unlocked: true, maxCount: 6, maxLevel: 14 },
        10: { unlocked: true, maxCount: 6, maxLevel: 14 },
        11: { unlocked: true, maxCount: 7, maxLevel: 15 },
        12: { unlocked: true, maxCount: 7, maxLevel: 15 },
        13: { unlocked: true, maxCount: 7, maxLevel: 16 },
        14: { unlocked: true, maxCount: 7, maxLevel: 16 },
        15: { unlocked: true, maxCount: 7, maxLevel: 16 },
        16: { unlocked: true, maxCount: 7, maxLevel: 16 },
        17: { unlocked: true, maxCount: 7, maxLevel: 16 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "elixir_collector",
      type: "resource",
      name: "Elixir Collector",
      category: "resource",
      maxLevels: 16,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 3 },
        2: { unlocked: true, maxCount: 2, maxLevel: 5 },
        3: { unlocked: true, maxCount: 3, maxLevel: 7 },
        4: { unlocked: true, maxCount: 4, maxLevel: 8 },
        5: { unlocked: true, maxCount: 5, maxLevel: 10 },
        6: { unlocked: true, maxCount: 6, maxLevel: 12 },
        7: { unlocked: true, maxCount: 6, maxLevel: 12 },
        8: { unlocked: true, maxCount: 6, maxLevel: 12 },
        9: { unlocked: true, maxCount: 6, maxLevel: 14 },
        10: { unlocked: true, maxCount: 6, maxLevel: 14 },
        11: { unlocked: true, maxCount: 7, maxLevel: 15 },
        12: { unlocked: true, maxCount: 7, maxLevel: 15 },
        13: { unlocked: true, maxCount: 7, maxLevel: 16 },
        14: { unlocked: true, maxCount: 7, maxLevel: 16 },
        15: { unlocked: true, maxCount: 7, maxLevel: 16 },
        16: { unlocked: true, maxCount: 7, maxLevel: 16 },
        17: { unlocked: true, maxCount: 7, maxLevel: 16 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "gold_storage",
      type: "resource",
      name: "Gold Storage",
      category: "resource",
      maxLevels: 17,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 4 },
        2: { unlocked: true, maxCount: 1, maxLevel: 6 },
        3: { unlocked: true, maxCount: 2, maxLevel: 8 },
        4: { unlocked: true, maxCount: 2, maxLevel: 9 },
        5: { unlocked: true, maxCount: 2, maxLevel: 11 },
        6: { unlocked: true, maxCount: 3, maxLevel: 12 },
        7: { unlocked: true, maxCount: 3, maxLevel: 12 },
        8: { unlocked: true, maxCount: 3, maxLevel: 12 },
        9: { unlocked: true, maxCount: 4, maxLevel: 14 },
        10: { unlocked: true, maxCount: 4, maxLevel: 15 },
        11: { unlocked: true, maxCount: 4, maxLevel: 16 },
        12: { unlocked: true, maxCount: 4, maxLevel: 16 },
        13: { unlocked: true, maxCount: 4, maxLevel: 17 },
        14: { unlocked: true, maxCount: 4, maxLevel: 17 },
        15: { unlocked: true, maxCount: 4, maxLevel: 17 },
        16: { unlocked: true, maxCount: 4, maxLevel: 17 },
        17: { unlocked: true, maxCount: 4, maxLevel: 17 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "elixir_storage",
      type: "resource",
      name: "Elixir Storage",
      category: "resource",
      maxLevels: 17,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 4 },
        2: { unlocked: true, maxCount: 1, maxLevel: 6 },
        3: { unlocked: true, maxCount: 2, maxLevel: 8 },
        4: { unlocked: true, maxCount: 2, maxLevel: 9 },
        5: { unlocked: true, maxCount: 2, maxLevel: 11 },
        6: { unlocked: true, maxCount: 3, maxLevel: 12 },
        7: { unlocked: true, maxCount: 3, maxLevel: 12 },
        8: { unlocked: true, maxCount: 3, maxLevel: 12 },
        9: { unlocked: true, maxCount: 4, maxLevel: 14 },
        10: { unlocked: true, maxCount: 4, maxLevel: 15 },
        11: { unlocked: true, maxCount: 4, maxLevel: 16 },
        12: { unlocked: true, maxCount: 4, maxLevel: 16 },
        13: { unlocked: true, maxCount: 4, maxLevel: 17 },
        14: { unlocked: true, maxCount: 4, maxLevel: 17 },
        15: { unlocked: true, maxCount: 4, maxLevel: 17 },
        16: { unlocked: true, maxCount: 4, maxLevel: 17 },
        17: { unlocked: true, maxCount: 4, maxLevel: 17 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "army_camp",
      type: "army",
      name: "Army Camp",
      category: "army",
      maxLevels: 12,
      availability: {
        1: { unlocked: true, maxCount: 1, maxLevel: 2 },
        2: { unlocked: true, maxCount: 1, maxLevel: 3 },
        3: { unlocked: true, maxCount: 2, maxLevel: 4 },
        4: { unlocked: true, maxCount: 2, maxLevel: 5 },
        5: { unlocked: true, maxCount: 3, maxLevel: 6 },
        6: { unlocked: true, maxCount: 3, maxLevel: 7 },
        7: { unlocked: true, maxCount: 4, maxLevel: 8 },
        8: { unlocked: true, maxCount: 4, maxLevel: 9 },
        9: { unlocked: true, maxCount: 4, maxLevel: 10 },
        10: { unlocked: true, maxCount: 4, maxLevel: 10 },
        11: { unlocked: true, maxCount: 4, maxLevel: 11 },
        12: { unlocked: true, maxCount: 4, maxLevel: 11 },
        13: { unlocked: true, maxCount: 4, maxLevel: 12 },
        14: { unlocked: true, maxCount: 4, maxLevel: 12 },
        15: { unlocked: true, maxCount: 4, maxLevel: 12 },
        16: { unlocked: true, maxCount: 4, maxLevel: 12 },
        17: { unlocked: true, maxCount: 4, maxLevel: 12 }
      },
      size: { width: 5, height: 5 }
    },
    {
      id: "barracks",
      type: "army",
      name: "Barracks",
      category: "army",
      maxLevels: 16,
      availability: {
        3: { unlocked: true, maxCount: 1, maxLevel: 5 },
        5: { unlocked: true, maxCount: 2, maxLevel: 8 },
        7: { unlocked: true, maxCount: 3, maxLevel: 10 },
        8: { unlocked: true, maxCount: 4, maxLevel: 12 },
        9: { unlocked: true, maxCount: 4, maxLevel: 13 },
        10: { unlocked: true, maxCount: 4, maxLevel: 14 },
        11: { unlocked: true, maxCount: 4, maxLevel: 15 },
        12: { unlocked: true, maxCount: 4, maxLevel: 15 },
        13: { unlocked: true, maxCount: 4, maxLevel: 16 },
        14: { unlocked: true, maxCount: 4, maxLevel: 16 },
        15: { unlocked: true, maxCount: 4, maxLevel: 16 },
        16: { unlocked: true, maxCount: 4, maxLevel: 16 },
        17: { unlocked: true, maxCount: 4, maxLevel: 16 }
      },
      size: { width: 3, height: 3 }
    },
    {
      id: "clan_castle",
      type: "army",
      name: "Clan Castle",
      category: "army",
      maxLevels: 12,
      availability: {
        3: { unlocked: true, maxCount: 1, maxLevel: 3 },
        4: { unlocked: true, maxCount: 1, maxLevel: 4 },
        5: { unlocked: true, maxCount: 1, maxLevel: 5 },
        6: { unlocked: true, maxCount: 1, maxLevel: 6 },
        7: { unlocked: true, maxCount: 1, maxLevel: 7 },
        8: { unlocked: true, maxCount: 1, maxLevel: 8 },
        9: { unlocked: true, maxCount: 1, maxLevel: 9 },
        10: { unlocked: true, maxCount: 1, maxLevel: 10 },
        11: { unlocked: true, maxCount: 1, maxLevel: 11 },
        12: { unlocked: true, maxCount: 1, maxLevel: 11 },
        13: { unlocked: true, maxCount: 1, maxLevel: 12 },
        14: { unlocked: true, maxCount: 1, maxLevel: 12 },
        15: { unlocked: true, maxCount: 1, maxLevel: 12 },
        16: { unlocked: true, maxCount: 1, maxLevel: 12 },
        17: { unlocked: true, maxCount: 1, maxLevel: 12 }
      },
      size: { width: 3, height: 3 }
    }
  ],
  townHalls: {
    1: {
      buildings: ["town_hall", "cannon", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp"],
      maxBuildings: { 
        town_hall: 1, cannon: 2, gold_mine: 1, elixir_collector: 1, 
        gold_storage: 1, elixir_storage: 1, army_camp: 1 
      }
    },
    2: {
      buildings: ["town_hall", "cannon", "archer_tower", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp"],
      maxBuildings: { 
        town_hall: 1, cannon: 2, archer_tower: 1, gold_mine: 2, elixir_collector: 2, 
        gold_storage: 1, elixir_storage: 1, army_camp: 1 
      }
    },
    3: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 3, archer_tower: 1, mortar: 1, gold_mine: 3, elixir_collector: 3, 
        gold_storage: 2, elixir_storage: 2, army_camp: 2, barracks: 1, clan_castle: 1 
      }
    },
    4: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 4, archer_tower: 2, mortar: 1, air_defense: 1, gold_mine: 4, elixir_collector: 4, 
        gold_storage: 2, elixir_storage: 2, army_camp: 2, barracks: 1, clan_castle: 1 
      }
    },
    5: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 5, archer_tower: 3, mortar: 2, air_defense: 1, wizard_tower: 1, gold_mine: 5, elixir_collector: 5, 
        gold_storage: 2, elixir_storage: 2, army_camp: 3, barracks: 2, clan_castle: 1 
      }
    },
    6: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 6, archer_tower: 4, mortar: 2, air_defense: 2, wizard_tower: 1, gold_mine: 6, elixir_collector: 6, 
        gold_storage: 3, elixir_storage: 3, army_camp: 3, barracks: 2, clan_castle: 1 
      }
    },
    7: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 7, archer_tower: 5, mortar: 3, air_defense: 3, wizard_tower: 2, tesla: 2, gold_mine: 6, elixir_collector: 6, 
        gold_storage: 3, elixir_storage: 3, army_camp: 4, barracks: 3, clan_castle: 1 
      }
    },
    8: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 7, archer_tower: 6, mortar: 4, air_defense: 4, wizard_tower: 3, tesla: 3, gold_mine: 6, elixir_collector: 6, 
        gold_storage: 3, elixir_storage: 3, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    9: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 7, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 6, elixir_collector: 6, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    10: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 7, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 6, elixir_collector: 6, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    11: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    12: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    13: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    14: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    15: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    16: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    },
    17: {
      buildings: ["town_hall", "cannon", "archer_tower", "mortar", "air_defense", "wizard_tower", "tesla", "gold_mine", "elixir_collector", "gold_storage", "elixir_storage", "army_camp", "barracks", "clan_castle"],
      maxBuildings: { 
        town_hall: 1, cannon: 8, archer_tower: 8, mortar: 4, air_defense: 4, wizard_tower: 4, tesla: 4, gold_mine: 7, elixir_collector: 7, 
        gold_storage: 4, elixir_storage: 4, army_camp: 4, barracks: 4, clan_castle: 1 
      }
    }
  }
};

// Helper functions
export const getBuildingsForTH = (thLevel: number): COCBuilding[] => {
  return COC_ASSETS.buildings.filter(building => 
    building.availability[thLevel]?.unlocked === true
  );
};

export const getMaxBuildingCount = (buildingId: string, thLevel: number): number => {
  const building = COC_ASSETS.buildings.find(b => b.id === buildingId);
  return building?.availability[thLevel]?.maxCount || 0;
};

export const getBuildingById = (buildingId: string): COCBuilding | undefined => {
  return COC_ASSETS.buildings.find(b => b.id === buildingId);
};

export const getTHBuildings = (thLevel: number): string[] => {
  return COC_ASSETS.townHalls[thLevel]?.buildings || [];
};

export const getBuildingsByCategory = (thLevel: number, category: string): COCBuilding[] => {
  return getBuildingsForTH(thLevel).filter(building => building.category === category);
};
