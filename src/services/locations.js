// src/services/locations.js
import api from './api'
import rawTouristData from '../assets/data/광주_전라권_관광지.json'

export async function fetchLocations(params = {}) {
  const res = await api.get('/locations', { params })
  return res.data
}

export async function fetchLocation(locationId, params = {}) {
  const res = await api.get(`/locations/${locationId}`, { params })
  return res.data
}

export async function fetchWaterRocketIndex(locationId) {
  const res = await api.get(`/locations/${locationId}/water-rocket-index`)
  return res.data
}

/**
 * 물로켓 TOP/극단 값을 가져오는 엔드포인트
 * 반환 예: { highest: [...], lowest: [...] }
 */
export async function fetchWaterRocketExtremes(limit = 3) {
  const res = await api.get('/locations/water-rocket-extremes', { params: { limit } })
  return res.data
}

/**
 * contentId -> backend internal id (숫자)로 변환
 * 전략:
 *  1) /locations?keyword=<contentId>&size=100 검색
 *  2) 캐시-버스트(_ts)로 재시도
 *  3) contentId가 숫자이면 /locations/{id} 직접 조회 (캐시버스트)
 *  4) 위 모두 실패하면 로컬 JSON(광주_전라권_관광지.json)의 순서(index+1)로 폴백
 */
export async function resolveLocationIdByContentId(contentId) {
  if (!contentId) return null
  const q = String(contentId).trim()
  if (!q) return null

  const trySearch = async (params) => {
    try {
      const data = await fetchLocations(params)
      const items = data.items ?? data.data ?? data ?? []
      for (const item of items) {
        const itemContent =
          item.content_id ??
          item.contentId ??
          item.contentid ??
          (item.content && (item.content.content_id ?? item.content.contentId ?? item.content.contentid)) ??
          ''
        if (String(itemContent) === q) {
          return item.id ?? item.location_id ?? null
        }
      }
      return null
    } catch (err) {
      console.debug('[locations] resolve search error', err?.response?.status ?? err?.message)
      return null
    }
  }

  // 1) 일반 검색
  let id = await trySearch({ keyword: q, size: 100 })
  if (id) return id

  // 2) 캐시-버스트 재시도
  id = await trySearch({ keyword: q, size: 100, _ts: Date.now() })
  if (id) return id

  // 3) numeric로 간주해 직접 조회
  const numeric = Number(q)
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    try {
      const maybe = await fetchLocation(numeric, { _ts: Date.now() })
      if (maybe?.id) return maybe.id
    } catch (e) {
      console.debug('[locations] direct fetch failed', e?.response?.status ?? e?.message)
    }
  }

  // 4) 로컬 JSON 순서 기반 폴백 (index + 1)
  try {
    const items = rawTouristData.items ?? []
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (String(it.contentid) === q) {
        const backendId = i + 1
        console.debug('[locations] local fallback mapping', q, '->', backendId)
        return backendId
      }
    }
  } catch (e) {
    console.debug('[locations] local fallback error', e?.message ?? e)
  }

  return null
}

/**
 * 로컬 항목 정보를 이용해 백엔드 id를 추정해본다.
 * (contentId 우선, title 검색, 좌표 근접 매칭)
 * 반환: backend id (number) or null
 */
export async function resolveLocationByLocalItem(localItem) {
  if (!localItem) return null

  // 1) contentId로 우선 시도
  try {
    const byContent = await resolveLocationIdByContentId(localItem.contentid ?? localItem.id)
    if (byContent) {
      console.debug('[locations] resolveByLocal matched by contentId', localItem.contentid, '->', byContent)
      return byContent
    }
  } catch (e) {
    console.debug('[locations] resolveByLocal contentId lookup failed', e?.message ?? e)
  }

  // 2) title 기반 검색 + 좌표 근접
  const title = (localItem.title || localItem.name || '').trim()
  if (!title) return null

  try {
    const data = await fetchLocations({ keyword: title, size: 200, _ts: Date.now() })
    const items = data.items ?? data.data ?? data ?? []
    console.debug('[locations] resolveByLocal title search', title, 'found', items.length)

    // 정확한 제목 매칭
    for (const it of items) {
      const itTitle = (it.title || it.name || '').trim()
      if (itTitle && itTitle === title) {
        console.debug('[locations] resolveByLocal exact title match', title, '->', it.id ?? it.location_id)
        return it.id ?? it.location_id ?? null
      }
    }

    // 좌표 근접 매칭
    const lx = Number(localItem.mapx), ly = Number(localItem.mapy)
    if (!Number.isNaN(lx) && !Number.isNaN(ly)) {
      let best = null, bestDist = Infinity
      for (const it of items) {
        const ix = Number(it.mapx ?? it.mapX ?? it.longitude ?? it.lng)
        const iy = Number(it.mapy ?? it.mapY ?? it.latitude ?? it.lat)
        if (Number.isNaN(ix) || Number.isNaN(iy)) continue
        const dx = ix - lx, dy = iy - ly
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < bestDist) { bestDist = dist; best = it }
      }
      const THRESHOLD = 0.02
      if (best && bestDist <= THRESHOLD) {
        console.debug('[locations] resolveByLocal coord match', best.id ?? best.location_id, 'dist', bestDist)
        return best.id ?? best.location_id ?? null
      }
    }
  } catch (e) {
    console.debug('[locations] resolveByLocal search error', e?.message ?? e)
  }

  return null
}