var tape = require('tape'),
    path = require('path'),
    fs = require('fs'),
    testData = path.dirname(require.resolve('mapnik-test-data')),
    mapnik_omnivore = require('../index.js'),

    expectedMetadata_world_merc = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_world_merc.json'))),
    expectedMetadata_fells_loop = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_fells_loop.json'))),
    expectedMetadata_DC_polygon = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_DC_polygon.json'))),
    expectedMetadata_bbl_csv = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_bbl_current_csv.json'))),
    expectedMetadata_1week_earthquake = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_1week_earthquake.json'))),
    expectedMetadata_sample_tif = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_sample_tif.json'))),
    expectedMetadata_sample_vrt = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_sample_vrt.json'))),
    expectedMetadata_topo = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_topo.json')));

/**
 * Testing mapnik-omnivore.digest
 */
tape('[SHAPE] Getting datasources: should return expected metadata', function(assert) {
  var file = testData + '/data/shp/world_merc/world_merc.shp';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_world_merc, 'expected metadata');
    assert.end();
  });
});

tape('[CSV] Getting datasources: should return expected metadata', function(assert) {
  var file = testData + '/data/csv/bbl_current_csv.csv';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) throw err;
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_bbl_csv, 'expected metadata');
    assert.end();
  });
});

tape('[KML] Getting datasources: should return expected metadata', function(assert) {
  var file = testData + '/data/kml/1week_earthquake.kml';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_1week_earthquake, 'expected metadata');
    assert.end();
  });
});

tape('[GeoJson] digest function should return expected metadata', function(assert) {
  var file = testData + '/data/geojson/DC_polygon.geo.json';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_DC_polygon, 'expected metadata');
    assert.end();
  });
});

tape('[TopoJson] digest function should return expected metadata', function(assert) {
  var file = testData + '/data/topojson/topo.json';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_topo, 'expected metadata');
    assert.end();
  });
});

tape('[RASTER] digest function should return expected metadata', function(assert) {
  var file = testData + '/data/geotiff/sample.tif';

  function trunc_6(val) {
    return Number(val.toFixed(6));
  }

  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    //Round extent values to avoid floating point discrepancies in Travis
    metadata.center[0] = trunc_6(metadata.center[0]);
    metadata.center[1] = trunc_6(metadata.center[1]);
    metadata.extent[0] = trunc_6(metadata.extent[0]);
    metadata.extent[1] = trunc_6(metadata.extent[1]);
    metadata.extent[2] = trunc_6(metadata.extent[2]);
    metadata.extent[3] = trunc_6(metadata.extent[3]);
    expectedMetadata_sample_tif.center[0] = trunc_6(expectedMetadata_sample_tif.center[0]);
    expectedMetadata_sample_tif.center[1] = trunc_6(expectedMetadata_sample_tif.center[1]);
    expectedMetadata_sample_tif.extent[0] = trunc_6(expectedMetadata_sample_tif.extent[0]);
    expectedMetadata_sample_tif.extent[1] = trunc_6(expectedMetadata_sample_tif.extent[1]);
    expectedMetadata_sample_tif.extent[2] = trunc_6(expectedMetadata_sample_tif.extent[2]);
    expectedMetadata_sample_tif.extent[3] = trunc_6(expectedMetadata_sample_tif.extent[3]);

    var bands_meta = metadata.raster.bands,
        bands_expected = expectedMetadata_sample_tif.raster.bands,
        pixelSize_expected = expectedMetadata_sample_tif.raster.pixelSize,
        pixelSize_meta = metadata.raster.pixelSize;

    //Round pixelsize and band mean/std_dev values for slight differences in Travis
    bands_meta.forEach(function(b) {
      b.stats.mean = trunc_6(b.stats.mean);
      b.stats.std_dev = trunc_6(b.stats.std_dev);
    });

    bands_expected.forEach(function(b) {
      b.stats.mean = trunc_6(b.stats.mean);
      b.stats.std_dev = trunc_6(b.stats.std_dev);
    });

    pixelSize_meta[0] = trunc_6(pixelSize_meta[0]);
    pixelSize_meta[1] = trunc_6(pixelSize_meta[1]);

    pixelSize_expected[0] = trunc_6(pixelSize_expected[0]);
    pixelSize_expected[1] = trunc_6(pixelSize_expected[1]);

    assert.deepEqual(metadata, expectedMetadata_sample_tif, 'expected metadata');
    assert.end();
  });
});

tape('[VRT] digest function should return expected metadata', function(assert) {
  var file = testData + '/data/vrt/sample.vrt';

  function trunc_6(val) {
    return Number(val.toFixed(6));
  }

  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    //Round extent values to avoid floating point discrepancies in Travis
    metadata.center[0] = trunc_6(metadata.center[0]);
    metadata.center[1] = trunc_6(metadata.center[1]);
    metadata.extent[0] = trunc_6(metadata.extent[0]);
    metadata.extent[1] = trunc_6(metadata.extent[1]);
    metadata.extent[2] = trunc_6(metadata.extent[2]);
    metadata.extent[3] = trunc_6(metadata.extent[3]);
    expectedMetadata_sample_vrt.center[0] = trunc_6(expectedMetadata_sample_vrt.center[0]);
    expectedMetadata_sample_vrt.center[1] = trunc_6(expectedMetadata_sample_vrt.center[1]);
    expectedMetadata_sample_vrt.extent[0] = trunc_6(expectedMetadata_sample_vrt.extent[0]);
    expectedMetadata_sample_vrt.extent[1] = trunc_6(expectedMetadata_sample_vrt.extent[1]);
    expectedMetadata_sample_vrt.extent[2] = trunc_6(expectedMetadata_sample_vrt.extent[2]);
    expectedMetadata_sample_vrt.extent[3] = trunc_6(expectedMetadata_sample_vrt.extent[3]);

    var bands_meta = metadata.raster.bands,
        pixelSize_meta = metadata.raster.pixelSize,
        bands_expected = expectedMetadata_sample_vrt.raster.bands,
        pixelSize_expected = expectedMetadata_sample_vrt.raster.pixelSize;

    // Round pixelsize and band mean/std_dev values for slight differences in Travis
    bands_meta.forEach(function(b) {
      b.stats.mean = trunc_6(b.stats.mean);
      b.stats.std_dev = trunc_6(b.stats.std_dev);
    });

    bands_expected.forEach(function(b) {
      b.stats.mean = trunc_6(b.stats.mean);
      b.stats.std_dev = trunc_6(b.stats.std_dev);
    });

    pixelSize_meta[0] = trunc_6(pixelSize_meta[0]);
    pixelSize_meta[1] = trunc_6(pixelSize_meta[1]);

    pixelSize_expected[0] = trunc_6(pixelSize_expected[0]);
    pixelSize_expected[1] = trunc_6(pixelSize_expected[1]);

    assert.deepEqual(metadata, expectedMetadata_sample_vrt, 'expected metadata');
    assert.end();
  });
});

tape('[GPX] Getting datasource: should return expected datasource and layer name', function(assert) {
  var file = testData + '/data/gpx/fells_loop.gpx';
  mapnik_omnivore.digest(file, function(err, metadata) {
    if (err) {
      assert.ifError(err, 'should not error');
      return assert.end();
    }
    assert.ok(err === null);

    assert.deepEqual(metadata, expectedMetadata_fells_loop, 'expected metadata');
    assert.end();
  });
});

tape('Getting filetype: should return an error due to incompatible file', function(assert) {
  var file = path.resolve('test/fixtures/invalid.unknown.tif');
  mapnik_omnivore.digest(file, function(err, result) {
    assert.ok(err instanceof Error);
    assert.notOk(result, 'no result returned');
    assert.equal('EINVALID', err.code);
    assert.equal(err.message, 'Unknown filetype');
    assert.end();
  });
});

tape('Getting filetype: should return an error because file does not exist.', function(assert) {
  var file = path.resolve('doesnt', 'exist.shp');
  mapnik_omnivore.digest(file, function(err, result) {
    assert.ok(err instanceof Error);
    assert.notOk(result, 'no result returned');
    assert.equal('ENOENT', err.code);
    assert.end();
  });
});
