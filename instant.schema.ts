// Palette Chat
// https://instantdb.com/dash?s=main&t=home&app=b624ebb3-5c3d-4416-87f2-24005d41aeb5

import { i } from "@instantdb/react";

const INSTANT_APP_ID = "b624ebb3-5c3d-4416-87f2-24005d41aeb5";

const graph = i.graph(
  INSTANT_APP_ID,
  {
    "channel": i.entity({
      "name": i.string(),
    }),
    "post": i.entity({
      "created_at": i.number(),
      "file_id": i.string(),
      "message": i.string(),
      "mux_id": i.string(),
    }),
    "profile": i.entity({
      "color": i.string(),
      "email": i.string(),
      "name": i.string(),
      "user_id": i.string(),
    }),
    "project": i.entity({
      "name": i.string(),
    }),
  },
  {
    "channelPosts": {
      "forward": {
        "on": "channel",
        "has": "many",
        "label": "posts"
      },
      "reverse": {
        "on": "post",
        "has": "one",
        "label": "channel"
      }
    },
    "projectChannels": {
      "forward": {
        "on": "project",
        "has": "many",
        "label": "channels"
      },
      "reverse": {
        "on": "channel",
        "has": "one",
        "label": "project"
      }
    }
  }
);

export default graph;
