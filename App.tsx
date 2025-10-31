import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEffect, useRef } from 'react';

const mapHTML = `
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
            color: 'rgba(255, 0, 0, 1)',  // red border
            width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.3)' // semi-transparent red fill
        })
      });

        const wildCatVectorLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
          features: [wildCatFeature]
          }),
          style: wildCatStyle
      });

        map.addLayer(wildCatVectorLayer);
    </script>
</body>
</html>
`;

function WebMap() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(mapHTML);
        iframeDoc.close();
      }
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Wildcat Canyon Map"
    />
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebMap />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
