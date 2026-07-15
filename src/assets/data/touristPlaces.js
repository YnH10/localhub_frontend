// src/assets/data/touristPlaces.js
import rawTouristData from './광주_전라권_관광지.json'

const sourceItems = rawTouristData.items ?? []

const buildImageUrl = (value) => {
  if (!value) return ''
  return value
}

const normalizePlace = (item, idx) => {
  const backendId = idx + 1
  return {
    id: item.contentid,                 // 원래 contentId 보존
    backendId: backendId,               // 백엔드에서 사용하는 순번 id (1-based)
    backendIdStr: String(backendId),
    name: item.title,
    address: [item.addr1, item.addr2].filter(Boolean).join(' ').trim(),
    region: rawTouristData.region,
    contentType: rawTouristData.contentType,
    contentTypeId: rawTouristData.contentTypeId,
    mainImage: buildImageUrl(item.firstimage),
    thumbnailImage: buildImageUrl(item.firstimage2 || item.firstimage),
    mapx: Number(item.mapx),
    mapy: Number(item.mapy),
    tel: item.tel,
    zipcode: item.zipcode,
    raw: item,
  }
}

export const touristPlaces = sourceItems.map((item, idx) => normalizePlace(item, idx))

export const getTouristPlaceById = (id) => {
  const targetId = String(id)
  return (
    touristPlaces.find(
      (place) =>
        String(place.id) === targetId || String(place.backendId) === targetId || String(place.backendIdStr) === targetId
    ) ?? null
  )
}

export const getTopTouristPlaces = (count = 3) => {
  return touristPlaces.slice(0, count)
}