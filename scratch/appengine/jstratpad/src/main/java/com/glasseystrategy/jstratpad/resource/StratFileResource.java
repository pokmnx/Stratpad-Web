package com.glasseystrategy.jstratpad.resource;

import com.glasseystrategy.jstratpad.dao.StratFileDao;
import com.glasseystrategy.jstratpad.inout.ResourceOut;
import com.glasseystrategy.jstratpad.inout.StatusOut;
import com.glasseystrategy.jstratpad.inout.StratFileIn;
import com.glasseystrategy.jstratpad.inout.StratFileOut;
import com.glasseystrategy.jstratpad.model.StratFile;
import com.glasseystrategy.jstratpad.util.BeanUtils;
import com.glasseystrategy.jstratpad.xml.StratFileXml;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.restlet.data.MediaType;
import org.restlet.ext.xml.SaxRepresentation;
import org.restlet.representation.EmptyRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.convert.AnnotationStrategy;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.strategy.Strategy;
import org.simpleframework.xml.stream.Format;
import org.xml.sax.InputSource;

/**
 * REST resource for the {@link StratFile} entity.
 */
public class StratFileResource extends JstratpadResource {

    /**
     */
    private static final Logger LOGGER = Logger
        .getLogger(StratFileResource.class.getName());

    /**
     * @param stratFile
     * @return a representation
     */
    private static Representation getXml(final StratFile stratFile) {
        final Strategy strategy = new AnnotationStrategy();
        final Format format = new Format(2);

        final StratFileXml stratFileXml = BeanUtils.mapXml(stratFile);
        final StringWriter out = new StringWriter();

        final Serializer serializer = new Persister(strategy, format);
        try {
            serializer.write(stratFileXml, out);
        } catch (final Exception ex) {
            LOGGER.log(Level.SEVERE, ex.getMessage(), ex);

            throw new RuntimeException("XML serialization failed");
        }

        final String xml = out.getBuffer().toString();

        final InputSource xmlSource = new InputSource(new StringReader(xml));

        return new SaxRepresentation(MediaType.APPLICATION_XML, xmlSource);
    }

    /**
     */
    public StratFileResource() {
        super();
    }

    /**
     * @return a representation
     */
    @Delete
    public Representation deleteStratFile() {
        // Retrieve the stratFile

        final StratFile stratFile = super.getAttributeStratFile();
        if (stratFile == null) {
            return resourceOutFail("StratFile not found");
        }

        // Delete the stratFile

        StratFileDao.deleteStratFile(stratFile);

        // Return the result

        final ResourceOut out = new ResourceOut(StatusOut.success);

        return jsonRepresentation(out);
    }

    /**
     * @return a representation
     */
    @Get("json")
    public Representation getJson() {
        // Retrieve the stratFile

        final StratFile stratFile = super.getAttributeStratFile();
        if (stratFile == null) {
            return resourceOutFail("StratFile not found");
        }

        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("stratFile: "
                + ToStringBuilder.reflectionToString(stratFile,
                    ToStringStyle.SHORT_PREFIX_STYLE));
        }

        // Update the lastAccessDate

        StratFileDao.updateStratFileLastAccessDate(stratFile, null);

        // Build the result

        final StratFileOut stratFileOut = BeanUtils.mapOut(stratFile);

        final ResourceOut out = new ResourceOut(StatusOut.success);
        out.getData().setStratFile(stratFileOut);

        // Return the result

        return jsonRepresentation(out);
    }

    /**
     * @return a representation
     */
    @Get("xml")
    public Representation getXml() {
        // Retrieve the stratFile

        final StratFile stratFile = super.getAttributeStratFile();
        if (stratFile == null) {
            return new EmptyRepresentation();
        }

        // Update the lastAccessDate

        StratFileDao.updateStratFileLastAccessDate(stratFile, null);

        // Return the result

        return getXml(stratFile);
    }

    /**
     * @param in
     * @return a representation
     */
    @Put("json")
    public Representation putStratFile(final StratFileIn in) {
        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("in: " + in);
        }

        // Validate content

        if (in == null) {
            return noContentProvided();
        }

        // Retrieve the stratFile

        final StratFile destination = super.getAttributeStratFile();
        if (destination == null) {
            return resourceOutFail("StratFile not found");
        }

        // Map source to destination

        final Long creationDate = destination.getCreationDate();
        final Long now = System.currentTimeMillis();

        final StratFile source = BeanUtils.map(in);
        source.setCreationDate(creationDate);
        source.setId(destination.getId());
        source.setLastAccessDate(now);
        source.setModificationDate(now);
        source.setRoot(destination.getRoot());
        source.setUser(destination.getUser());
        source.setUuid(destination.getUuid());

        BeanUtils.map(source, destination);

        // Update the stratFile

        StratFileDao.updateStratFile(destination);

        // Return the result

        final StratFileOut stratFileOut = BeanUtils.mapOut(destination);

        final ResourceOut out = new ResourceOut(StatusOut.success);
        out.getData().setStratFile(stratFileOut);

        return jsonRepresentation(out);
    }
}
