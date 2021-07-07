import { Schema } from "mongoose";

const key = process.env.GoogleAPIkey; // todo: get key

export interface IAddress {
  street: string;
  streetNumber: string;
  additionalLines: string;
  zip: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const AddressSchema = new Schema<IAddress>(
  {
    street: {
      type: String,
    },
    streetNumber: {
      type: String,
    },
    additionalLines: {
      type: String,
    },
    zip: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    coordinates: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },
  { _id: false }
);

AddressSchema.pre("save", function () {
  if (!this.modifiedPaths().includes("coordinates")) {
    //this.set("coordinates", getCoordinates); // if address has been changed, update coordinates
  }
});

async function getCoordinates(document: IAddress) {
  const addressString =
    (document.streetNumber + " " || "") +
    " " +
    (document.street + " " || "") +
    " " +
    +(document.additionalLines + " " || "") +
    document.zip +
    " " +
    document.country;
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "&key=" + key;

  const res = await fetch(url);
  const data = await res.json();
  let coordinates;

  if (data.status !== "OK") throw data.status + ". Could not get coordinates for " + addressString;
  else coordinates = data.results.geometry.location;

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
}
