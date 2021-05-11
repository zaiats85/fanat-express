import format from "pg-format";
import { dbClient } from "../../config/db";
import { subscribe } from "../../config/messenger";

subscribe(({ features }: { features: IFeature[] }) => {
  const featuresWithHighConfidence = features.filter(
      (feature: IFeature) => feature.properties.confidence >= 8,
  );

  addPlaces(featuresWithHighConfidence);
});

const addPlaces = async (features: IFeature[]) => {
  const res = features.map((feature: IFeature) => [JSON.stringify(feature)]);

  await dbClient.query(
      format('INSERT INTO "TopPlaces" (feature) VALUES %L', res),
  );
};

export const getPlaces = async (offset = 0, limit = 20) => {
  const res = await dbClient.query(
      'SELECT * FROM "TopPlaces" LIMIT $1 OFFSET $2;',
      [limit, offset],
  );
  return res.rows;
};
