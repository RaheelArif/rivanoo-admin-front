import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Helvetica font for Swedish characters
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas/helvetica@1.0.1/Helvetica.ttf' },
        { 
            src: 'https://cdn.jsdelivr.net/npm/@canvas/helvetica@1.0.1/Helvetica-Bold.ttf',
            fontWeight: 'bold'
        }
    ]
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 40
    },
    rivanooText: {
        fontSize: 24,
        marginBottom: 10
    },
    cdonText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20
    },
    thankYouText: {
        fontSize: 12,
        marginBottom: 6
    },
    hopeText: {
        fontSize: 12,
        marginBottom: 40
    },
    deliverySection: {
        position: 'absolute',
        top: 40,
        right: 40,
        width: 200
    },
    deliveryTitle: {
        fontSize: 24,
        marginBottom: 10
    },
    deliveryAddress: {
        fontSize: 12,
        lineHeight: 1.4
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        paddingBottom: 5,
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        backgroundColor: '#f5f5f5'
    },
    columnHeader: {
        fontSize: 12,
        fontWeight: 600 // Updated: Header font weight
    },
    columnCell: {
        fontSize: 10,
    },
    // Column widths
    ordernr: { width: 100 },
    date: { width: 100 },
    orgnr: { width: 100 },
    kundnr: { width: 100 },
    mobilnr: { width: 120 },
    valuta: { width: 50 },
    sida: { width: 50 },
    // Product table columns
    varunr: { width: 100 },
    ean: { width: 120 },
    produkt: { width: 300 },
    plockplats: { width: 80 },
    antal: { width: 50 }
});

const DeliveryNotePDF = ({ order }) => {
    const {
        OrderDetails: {
            OrderId,
            CreatedDateUtc,
            CustomerInfo,
            OrderRows
        }
    } = order;

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Left side header */}
                <View style={styles.header}>
                    <Text style={styles.rivanooText}>Rivanoo</Text>
                    <Text style={styles.cdonText}>CDON</Text>
                    <Text style={styles.thankYouText}>Tack för att du handlat hos oss på CDON.</Text>
                    <Text style={styles.hopeText}>Vi hoppas du blir nöjd med ditt köp och{'\n'}att du besöker oss snart igen :)</Text>
                </View>

                {/* Right side delivery address */}
                <View style={styles.deliverySection}>
                    <Text style={styles.deliveryTitle}>Följesedel</Text>
                    <Text style={styles.deliveryAddress}>Leveransadress</Text>
                    <Text style={styles.deliveryAddress}>
                        {CustomerInfo.ShippingAddress?.Name}{'\n'}
                        {CustomerInfo.ShippingAddress?.StreetAddress}{'\n'}
                        {CustomerInfo.ShippingAddress?.ZipCode} {CustomerInfo.ShippingAddress?.City}{'\n'}
                        {CustomerInfo.ShippingAddress?.Country}
                    </Text>
                </View>

                {/* Order details table */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.columnHeader, styles.ordernr]}>Ordernr.</Text>
                    <Text style={[styles.columnHeader, styles.date]}>Orderdatum</Text>
                    <Text style={[styles.columnHeader, styles.orgnr]}>Orgnr</Text>
                    <Text style={[styles.columnHeader, styles.kundnr]}>Kundnr.</Text>
                    <Text style={[styles.columnHeader, styles.mobilnr]}>Mobilnr.</Text>
                    <Text style={[styles.columnHeader, styles.valuta]}>Valuta</Text>
                    <Text style={[styles.columnHeader, styles.sida]}>Sida</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.columnCell, styles.ordernr]}>{OrderId}</Text>
                    <Text style={[styles.columnCell, styles.date]}>{formatDate(CreatedDateUtc)}</Text>
                    <Text style={[styles.columnCell, styles.orgnr]}></Text>
                    <Text style={[styles.columnCell, styles.kundnr]}>{CustomerInfo.CustomerId}</Text>
                    <Text style={[styles.columnCell, styles.mobilnr]}>{CustomerInfo.Phones?.PhoneMobile}</Text>
                    <Text style={[styles.columnCell, styles.valuta]}>SEK</Text>
                    <Text style={[styles.columnCell, styles.sida]}>1/2</Text>
                </View>

                {/* Products table */}
                <View style={[styles.tableHeader, { marginTop: 20 }]}>
                    <Text style={[styles.columnHeader, styles.varunr]}>Varunr.</Text>
                    <Text style={[styles.columnHeader, styles.ean]}>EAN/IMEI</Text>
                    <Text style={[styles.columnHeader, styles.produkt]}>Produkt</Text>
                    <Text style={[styles.columnHeader, styles.plockplats]}>Plockplats</Text>
                    <Text style={[styles.columnHeader, styles.antal]}>Antal</Text>
                </View>
                {OrderRows.map((row, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.columnCell, styles.varunr]}>{row.ProductId}</Text>
                        <Text style={[styles.columnCell, styles.ean]}>{row.Gtin}</Text>
                        <Text style={[styles.columnCell, styles.produkt]}>{row.ProductName}</Text>
                        <Text style={[styles.columnCell, styles.plockplats]}></Text>
                        <Text style={[styles.columnCell, styles.antal]}>{row.Quantity}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default DeliveryNotePDF;