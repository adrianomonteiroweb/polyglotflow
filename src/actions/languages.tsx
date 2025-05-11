"use server";

import {
  LanguageRepository,
  GetLanguageParams,
} from "@/db/repositories/LanguageRepository";

export async function getLanguages(params: GetLanguageParams = {}) {
  return await LanguageRepository.getLanguages(params);
}

export async function getLanguageById(id: number) {
  return await LanguageRepository.findById(id);
}

export async function createLanguage(data: any) {
  return await LanguageRepository.create(data);
}

export async function updateLanguage(id: number, data: any) {
  return await LanguageRepository.update(id, data);
}

export async function removeLanguage(id: number) {
  return await LanguageRepository.deleteById(id);
}
