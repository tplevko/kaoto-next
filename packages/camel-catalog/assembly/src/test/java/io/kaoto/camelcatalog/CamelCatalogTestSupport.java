package io.kaoto.camelcatalog;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import java.nio.file.Paths;

public class CamelCatalogTestSupport {
    protected static final ObjectMapper jsonMapper = new ObjectMapper();
    protected static final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
    protected static final JsonFactory jsonFactory = new JsonFactory();

    private static ObjectNode index = null;

    protected ObjectNode getIndex() throws Exception {
        if (CamelCatalogTestSupport.index == null) {
            var path = Paths.get("..").resolve("dist").resolve("index.json");
            CamelCatalogTestSupport.index = (ObjectNode) jsonMapper.readTree(path.toFile());
        }
        return CamelCatalogTestSupport.index;
    }

    protected ObjectNode getSchema(String name) throws Exception {
        var schema = getIndex().withObject("/schemas").withObject("/" + name);
        return (ObjectNode) jsonMapper.readTree(
                Paths.get("..").resolve("dist").resolve(schema.get("file").asText()).toFile());
    }
}