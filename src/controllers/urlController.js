const Url = require('../models/url');
const { isValidUrl } = require('../utils/validation');
const { nanoid } = require('nanoid');

// Create a short URL. Supports optional customAlias.
exports.createShortUrl = async (req, res, next) => {
  try {
    const { longUrl, customAlias } = req.body;

    if (!longUrl || !isValidUrl(longUrl)) {
      return res.status(400).json({ message: 'Invalid longUrl' });
    }

    // If customAlias provided, ensure it's not already used as shortId or customAlias
    if (customAlias) {
      const exists = await Url.findOne({ $or: [{ customAlias }, { shortId: customAlias }] });
      if (exists) return res.status(409).json({ message: 'customAlias already in use' });
    }

    const shortId = customAlias || nanoid(8);

    // Double-check shortId uniqueness (race-safe attempts should use DB unique index)
    const collision = await Url.findOne({ shortId });
    if (collision) {
      // Rare: if collision and user didn't provide alias, generate another
      if (!customAlias) {
        const altId = nanoid(10);
        const url = new Url({ shortId: altId, longUrl });
        await url.save();
        return res.status(201).json({ id: url._id, shortUrl: `${process.env.BASE_URL || ''}/${altId}`, longUrl: url.longUrl });
      }
      return res.status(409).json({ message: 'Alias already in use' });
    }

    const url = new Url({ shortId, longUrl, customAlias: customAlias || null });
    await url.save();

    return res.status(201).json({ id: url._id, shortUrl: `${process.env.BASE_URL || ''}/${shortId}`, longUrl: url.longUrl });
  } catch (err) {
    // Handle validation/DB errors
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    next(err);
  }
};

// Redirect to the original long URL and increment analytics
exports.redirectToLongUrl = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ $or: [{ shortId }, { customAlias: shortId }] });
    if (!url) return res.status(404).json({ message: 'Not found' });

    // Update analytics: increment clicks and set lastAccess
    url.clicks = (url.clicks || 0) + 1;
    url.lastAccess = new Date();

    // Save asynchronously but ensure error handling
    await url.save();

    // Use 302 redirect to long URL
    return res.redirect(url.longUrl);
  } catch (err) {
    next(err);
  }
};

// Get URL metadata and analytics by database ID
exports.getUrlById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id).select('-__v');
    if (!url) return res.status(404).json({ message: 'Not found' });
    return res.json(url);
  } catch (err) {
    // If invalid ObjectId
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
    next(err);
  }
};
