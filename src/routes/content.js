import contentModel from "../models/contentModel.js";
import { Router } from "express";

const content = Router();

content.get("/batch/:batchSlug/:subjectSlug/contents", async (req, res) => {
  try {
    const _slug = req.params.subjectSlug;
    const GetContent = await contentModel
      .find({ subject: _slug })
      .find(req.query)
      .select(["-__v", "-subject", "-contentType"]).sort({ _id: 1 });
    res.setHeader("Cache-Control", "public, s-maxage=1, stale-while-revalidate=1");
    res.send({ success: true, Data: GetContent });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

let currentIndex = 1;

content.post("/batch/:batchSlug/:subjectSlug/:chapterSlug", async (req, res) => {
  try {
    const _slug = req.params.chapterSlug;
    const _subSlug = req.params.subjectSlug;
    const dataArray = req.body;

    const createContent = await contentModel.insertMany(
      dataArray.map(({ name, image, contentType, contentUrl }) => {
        const newIndex = currentIndex++;
        return {
          name,
          image,
          contentType,
          contentUrl,
          tag: _slug,
          subject: _subSlug,
          index: newIndex,
        };
      })
    );
    
    res.status(201).send({
      success: true,
      message: `Contents Created: ${createContent.length} items`,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

content.delete("/batch/:batchSlug/:subjectSlug/:contents/:ids", async (req, res) => {
  try {
    const ids = req.params.ids.split(",");
    const delContent = await contentModel.deleteMany({ _id: { $in: ids } });
    res.send({
      success: true,
      message: `Contents Deleted: ${delContent.deletedCount} items`,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

export default content;
