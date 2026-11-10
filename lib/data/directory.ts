import {
  PROVIDER_CATEGORIES,
  PROVIDER_FEATURES,
  type Provider,
  type ProviderCategory,
} from "@/lib/data/providers";

export type DirectoryParams = {
  q: string;
  city: string;
  type: string;
  species: string;
  feature: string;
  services: string[];
  sort: "featured" | "name";
};

export type DirectorySearchParams = Record<string, string | string[] | undefined>;

// URL parameter aliases for shareable, human-readable search links.
// Internal params remain canonical (city/type/species); aliases are accepted on read.
const PARAM_ALIASES: Record<string, string> = {
  location: "city",
  category: "type",
  animal: "species",
  service: "feature",
} as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseDirectoryParams(
  searchParams: DirectorySearchParams,
): DirectoryParams {
  // Resolve aliases to canonical params before validation.
  const resolved: DirectorySearchParams = {};
  for (const [key, value] of Object.entries(searchParams)) {
    const canonical = PARAM_ALIASES[key] ?? key;
    // Only set if not already provided by the canonical name.
    if (!(canonical in resolved)) {
      resolved[canonical] = value;
    }
  }

  const sort = first(resolved.sort) === "name" ? "name" : "featured";
  const type = first(resolved.type);
  const feature = first(resolved.feature);
  const species = first(resolved.species);
  const city = first(resolved.city);
  const q = first(resolved.q).slice(0, 120);

  // Collect all service checkbox values (multi-select).
  const serviceRaw = resolved.service;
  const services: string[] = Array.isArray(serviceRaw)
    ? serviceRaw.slice(0, 20)
    : serviceRaw
      ? [serviceRaw.slice(0, 80)]
      : [];

  return {
    q,
    city: city.slice(0, 60),
    type: PROVIDER_CATEGORIES.some((category) => category.value === type)
      ? type
      : "",
    species: species.slice(0, 40),
    feature: PROVIDER_FEATURES.some((item) => item.value === feature)
      ? feature
      : "",
    services,
    sort,
  };
}

export function filterProviders(list: Provider[], params: DirectoryParams) {
  const query = params.q.trim().toLowerCase();

  const filtered = list.filter((provider) => {
    if (provider.status !== "published") return false;
    if (params.city && provider.city !== params.city) return false;
    if (params.type && provider.category !== (params.type as ProviderCategory)) {
      return false;
    }
    if (params.species && !provider.species.includes(params.species)) return false;
    if (params.feature && !provider.features.includes(params.feature as never)) {
      return false;
    }
    if (params.services.length > 0) {
      const hasAnyService = params.services.some((service) =>
        provider.services.some(
          (providerService) =>
            providerService.toLowerCase() === service.toLowerCase(),
        ),
      );
      if (!hasAnyService) return false;
    }
    if (query) {
      const category = PROVIDER_CATEGORIES.find(
        (item) => item.value === provider.category,
      );
      const haystack = [
        provider.name,
        provider.about,
        provider.city,
        provider.area,
        provider.category,
        category?.label ?? "",
        ...provider.services,
        ...provider.species,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (params.sort === "name") return a.name.localeCompare(b.name);
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function directoryHref(
  params: DirectoryParams,
  overrides: Partial<DirectoryParams> = {},
) {
  const next = { ...params, ...overrides };
  const search = new URLSearchParams();
  if (next.q) search.set("q", next.q);
  if (next.city) search.set("city", next.city);
  if (next.type) search.set("type", next.type);
  if (next.species) search.set("species", next.species);
  if (next.feature) search.set("feature", next.feature);
  next.services.forEach((service) => search.append("service", service));
  if (next.sort && next.sort !== "featured") search.set("sort", next.sort);
  const query = search.toString();
  return query ? `/find?${query}` : "/find";
}

export function activeFilterLabels(params: DirectoryParams) {
  const labels: { key: keyof DirectoryParams; label: string }[] = [];
  if (params.type) {
    const category = PROVIDER_CATEGORIES.find((item) => item.value === params.type);
    labels.push({ key: "type", label: category?.label ?? params.type });
  }
  if (params.city) labels.push({ key: "city", label: params.city });
  if (params.species) labels.push({ key: "species", label: params.species });
  if (params.feature) {
    const feature = PROVIDER_FEATURES.find((item) => item.value === params.feature);
    labels.push({ key: "feature", label: feature?.label ?? params.feature });
  }
  params.services.forEach((service) => {
    labels.push({ key: "services", label: service });
  });
  if (params.q) labels.push({ key: "q", label: `“${params.q}”` });
  return labels;
}
