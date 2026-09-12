export interface WilayahItem {
  id: string;
  name: string;
}

const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

async function fetchWithSessionCache(key: string, url: string): Promise<WilayahItem[]> {
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as WilayahItem[];
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal memuat data wilayah");
    const data = (await response.json()) as WilayahItem[];
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch {
    return [];
  }
}

export const wilayahService = {
  getProvinces: () => fetchWithSessionCache("wilayah_provinces", `${BASE_URL}/provinces.json`),
  getRegencies: (provId: string) => fetchWithSessionCache(`wilayah_reg_${provId}`, `${BASE_URL}/regencies/${provId}.json`),
  getDistricts: (regId: string) => fetchWithSessionCache(`wilayah_dist_${regId}`, `${BASE_URL}/districts/${regId}.json`),
  getVillages: (distId: string) => fetchWithSessionCache(`wilayah_vill_${distId}`, `${BASE_URL}/villages/${distId}.json`),
};
