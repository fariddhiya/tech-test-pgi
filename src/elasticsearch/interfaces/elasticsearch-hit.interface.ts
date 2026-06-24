export interface ElasticsearchHit<T> {
  _index: string;
  _id: string;
  _score: number | null;
  _source: T;
}

export interface ElasticsearchHitsResponse<T> {
  total: { value: number; relation: string };
  hits: Array<ElasticsearchHit<T>>;
}
