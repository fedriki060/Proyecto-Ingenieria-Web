import type { Space, CreateSpaceDTO } from "../types";
import { seedSpaces } from "../data/seed";

let spaces = [...seedSpaces];

export function getSpaces(): Space[] {
  return [...spaces];
}

export function getSpaceById(id: number): Space | undefined {
  return spaces.find((s) => s.id === id);
}

export function getSpacesByBuilding(building: string): Space[] {
  return spaces.filter((s) => s.building === building);
}

export function getSpacesByType(type: string): Space[] {
  return spaces.filter((s) => s.type === type);
}

export function getAvailableSpaces(): Space[] {
  return spaces.filter((s) => s.isActive);
}

export function createSpace(dto: CreateSpaceDTO): Space {
  const newSpace: Space = {
    id: Math.max(...spaces.map((s) => s.id), 0) + 1,
    ...dto,
    isActive: true,
    createdAt: new Date(),
  };

  spaces.push(newSpace);
  return newSpace;
}

export function updateSpace(id: number, updates: Partial<CreateSpaceDTO>): Space | null {
  const space = spaces.find((s) => s.id === id);
  if (!space) return null;

  Object.assign(space, updates);
  return space;
}

export function deactivateSpace(id: number): Space | null {
  const space = spaces.find((s) => s.id === id);
  if (!space) return null;

  space.isActive = false;
  return space;
}