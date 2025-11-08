import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, Pressable, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEffect, useRef, useState } from 'react';
import { getNativePlants } from './src/services/observationsService';
import type {
  NativePlantObservation,
  NativePlantFilterParams,
} from './src/types/api';
import { FilterPanel, type FilterValues } from './src/components/FilterPanel';

const generateMapHTML = (plants: NativePlantObservation[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wildcat Canyon Regional Park</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.3.1/ol.css">
    <script src="https://cdn.jsdelivr.net/npm/ol@v10.3.1/dist/ol.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #map {
            width: 100%;
            height: 100%;
        }
        .ol-tooltip {
            position: relative;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 4px;
            color: white;
            padding: 8px 12px;
            opacity: 0.9;
            white-space: nowrap;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            pointer-events: none;
        }
        .ol-tooltip:before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border: 5px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.8);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Wildcat Canyon Regional Park coordinates
        const longitude = -122.3138;
        const latitude = 37.94836;

        // Create map
        const map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([longitude, latitude]),
                zoom: 14
            })
        });

        const wkt = 'POLYGON((-122.28112 37.91874,-122.27067 37.92392,-122.27061 37.92138,-122.26765 37.92143,-122.262 37.92416,-122.2659 37.93392,-122.27042 37.93614,-122.28178 37.94702,-122.28391 37.9473,-122.28559 37.95072,-122.29028 37.95304,-122.28642 37.95197,-122.28435 37.95408,-122.29229 37.95429,-122.2975 37.95679,-122.29822 37.95575,-122.29613 37.95525,-122.29899 37.95366,-122.30203 37.95487,-122.30175 37.95264,-122.30828 37.95267,-122.30794 37.96,-122.31055 37.96004,-122.31557 37.9594,-122.31875 37.95404,-122.3244 37.95385,-122.32226 37.95131,-122.3163 37.95097,-122.31596 37.94868,-122.3138 37.94836,-122.31248 37.94682,-122.31136 37.94882,-122.30721 37.9454,-122.31131 37.9456,-122.31168 37.94403,-122.3101 37.94503,-122.29522 37.93138,-122.29224 37.93069,-122.29064 37.92924,-122.2918 37.92726,-122.28112 37.91874),(-122.31321 37.95783,-122.31039 37.95636,-122.31337 37.95701,-122.31321 37.95783))';

        const format = new ol.format.WKT();
        const wildCatFeature = format.readFeature(wkt, {
            dataProjection: 'EPSG:4326',   // projection of your WKT coordinates
            featureProjection: 'EPSG:3857' // projection of your map view
        });

        const wildCatStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
            color: 'rgb(0, 128, 255)',
            width: 1,
            radius: 5,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 140, 255, 0.1)'
        })
      });

        const wildCatVectorLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
          features: [wildCatFeature]
          }),
          style: wildCatStyle
      });

        map.addLayer(wildCatVectorLayer);

        // Native plants data
        const nativePlants = ${JSON.stringify(plants)};

        // Create features for each native plant observation
        const plantFeatures = nativePlants.map(plant => {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([plant.decimal_longitude, plant.decimal_latitude])
                ),
                name: plant.common_name,
                scientificName: plant.scientific_name,
                occurrenceId: plant.occurrence_id
            });
            return feature;
        });

        // Create a light green plant SVG icon
        const plantSvg = \`
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="64"
              height="64"
            >
              <g
                fill="#2ecc71"
                stroke="#27ae60"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- slightly curved stem -->
                <path d="M32 52c-1-8-1-16 0-26 0-2 0-4 0-6s0-2 0-2c0 0-2 1-3 3-1 2-1 4-1 6 0 8 1 16 2 24 0 1 1 2 2 2s2-1 2-2z" />

                <!-- left leaf (curvier and smoother) -->
                <path d="M29 26c-7-5-15-7-21-3 3 5 9 9 17 9 3 0 5-2 5-6 0 0 0 0-1 0z" />

                <!-- right leaf (curvier and smoother) -->
                <path d="M35 26c7-5 15-7 21-3-3 5-9 9-17 9-3 0-5-2-5-6 0 0 0 0 1 0z" />
              </g>
            </svg>
        \`;

        // Convert SVG to data URI
        const plantIconUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(plantSvg);

        // Create a style for the plant markers with plant icon
        const plantStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: plantIconUri,
                scale: 0.8,
                anchor: [0.5, 1], // Anchor at bottom center
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction'
            })
        });

        // Create a vector layer for the plant markers
        const plantVectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: plantFeatures
            }),
            style: plantStyle
        });

        map.addLayer(plantVectorLayer);

        // Create tooltip overlay
        const tooltip = document.createElement('div');
        tooltip.className = 'ol-tooltip';
        const tooltipOverlay = new ol.Overlay({
            element: tooltip,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(tooltipOverlay);

        // Handle pointer move for hover effect
        map.on('pointermove', function(evt) {
            const pixel = map.getEventPixel(evt.originalEvent);
            const feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                if (layer === plantVectorLayer) {
                    return feature;
                }
            });

            if (feature) {
                const name = feature.get('name');
                tooltip.innerHTML = name;
                tooltipOverlay.setPosition(evt.coordinate);
                tooltip.style.display = 'block';
                map.getTargetElement().style.cursor = 'pointer';
            } else {
                tooltip.style.display = 'none';
                map.getTargetElement().style.cursor = '';
            }
        });

        // Handle click to open gbif link
        map.on('click', function(evt) {
            const pixel = map.getEventPixel(evt.originalEvent);
            const feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                if (layer === plantVectorLayer) {
                    return feature;
                }
            });

            if (feature) {
                const occurrenceId = feature.get('occurrenceId');
                if (occurrenceId) {
                    const gbifUrl = 'https://www.gbif.org/occurrence/' + occurrenceId;
                    window.open(gbifUrl, '_blank');
                }
            }
        });
    </script>
</body>
</html>
`;

function WebMap({ plants }: { plants: NativePlantObservation[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generateMapHTML(plants));
        iframeDoc.close();
      }
    }
  }, [plants]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Wildcat Canyon Map"
    />
  );
}

export default function App() {
  const [plants, setPlants] = useState<NativePlantObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const fetchPlants = async (filterParams?: FilterValues) => {
    setLoading(true);
    try {
      const params: NativePlantFilterParams = {};

      if (filterParams?.startTime) {
        params.start_time = filterParams.startTime;
      }
      if (filterParams?.endTime) {
        params.end_time = filterParams.endTime;
      }
      if (filterParams?.commonName) {
        params.common_name = filterParams.commonName;
      }
      if (filterParams?.scientificName) {
        params.scientific_name = filterParams.scientificName;
      }

      const data = await getNativePlants(params);
      setPlants(data);
    } catch (error) {
      console.error('Error fetching native plants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load current year on initial mount
    const currentYear = new Date().getFullYear();
    const initialFilters = {
      startTime: `${currentYear}-01-01T00:00:00`,
      endTime: `${currentYear}-12-31T23:59:59`,
    };
    fetchPlants(initialFilters);
  }, []);

  const handleFilterChange = (newFilters: FilterValues) => {
    fetchPlants(newFilters);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        ></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Button */}
      <Pressable
        style={styles.filterButton}
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <Text style={styles.filterIcon}>⚙</Text>
      </Pressable>

      {/* Filter Panel */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
      />

      {/* Map */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <WebMap plants={plants} />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: generateMapHTML(plants) }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      {/* Count Indicator */}
      <View style={styles.countIndicator}>
        <Text style={styles.countText}>
          {plants.length} observation{plants.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#7CB342',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  filterIcon: {
    fontSize: 24,
    color: '#fff',
  },
  countIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
