import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "posts",
        label: "Posts",
        path: "content/posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            required: true,
            list: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: true,
            list: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "object",
            name: "thumbnail",
            label: "Post Thumbnail",
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
              },
              {
                type: "string",
                name: "visibility",
                label: "Visibility",
              },
            ],
          },
          {
            type: "boolean",
            name: "authorbox",
            label: "Authorbox",
            required: false,
          },
          {
            type: "boolean",
            name: "sidebar",
            label: "Sidebar",
            required: false,
          },
          {
            type: "boolean",
            name: "pager",
            label: "Pager",
            required: false,
          },
          {
            type: "boolean",
            name: "toc",
            label: "Table of Contents",
            required: false,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            required: false,
          },
          {
            type: "number",
            name: "weight",
            label: "Weight",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "glightbox",
                label: "glightbox",
                match: {
                  start: "{{<",
                  end: ">}}",
                },
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "value",
                    required: true,
                  },
                ],
              },
              {
                name: "youtube",
                label: "youtube",
                match: {
                  start: "{{<",
                  end: ">}}",
                },
                fields: [
                  {
                    type: "string",
                    name: "_value",
                    label: "value",
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "menu",
        label: "Menu",
        path: "content/menu",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "menu",
            label: "Menu",
            required: true,
          },
          {
            type: "number",
            name: "weight",
            label: "Weight",
            required: true,
          },
          {
            type: "boolean",
            name: "authorbox",
            label: "Authorbox",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
