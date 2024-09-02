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
      "file_id": i.string(),
      "created_at": i.string(),
      "message": i.string(),
      "mux_id": i.string(),
    }),
    "project": i.entity({
      "name": i.string(),
    }),
    "user": i.entity({
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
    },
    "projectUsers": {
      "forward": {
        "on": "project",
        "has": "many",
        "label": "users"
      },
      "reverse": {
        "on": "user",
        "has": "many",
        "label": "projects"
      }
    },
    "userPosts": {
      "forward": {
        "on": "user",
        "has": "many",
        "label": "posts"
      },
      "reverse": {
        "on": "post",
        "has": "one",
        "label": "author"
      }
    }
  }
);

export default graph;
