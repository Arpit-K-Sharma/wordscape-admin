import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  section: {
    margin: 5,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 3,
    // boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
  },
  title: {
    fontSize: 10,
    marginBottom: 9,
    textAlign: "center",
    color: "#1e293b",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 8,
    marginBottom: 5,
    color: "#334155",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: "60%",
    color: "#64748b",
    fontSize: 8,
    marginRight: 5,
  },
  value: {
    width: "40%",
    color: "#0f172a",
    fontSize: 8,
  },
  table: {
    // display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 3,
    marginBottom: 3,
    fontSize: 8,
    color: "#334155",
  },
  tableHeader: {
    backgroundColor: "#e2e8f0",
    fontWeight: "bold",
  },
  column: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardId: {
    fontSize: 10,
    color: '#64748b',
  }
});

interface DeliveryDetail {
  [key: string]: string | number | string[];
}

interface PrePressUnitList {
  [key: string]: string | number | string[];
}

interface BinderyData {
  [key: string]: string | number | string[];
}

interface PaperData {
  paperData0: {
    [key: string]: string | number | string[];
  };
  paperData1?: any[];
  paperData2?: any[];
  paperData3?: any[];
}

interface PrePressData {
  [key: string]: string | number;
}

interface PlateDetailData {
  plateData?: any[];
  [key: string]: any;
}

interface PaperDetailData {
  [key: string]: string | number | string[];
}

interface PressUnitData {
  pressData?: any[];
  [key: string]: any;
}

interface CostCalculation {
  costCalculationId: string | number;
  billingInfo: {
    [key: string]: string | number;
  };
  [key: string]: any;
}

interface PDFGeneratorProps {
  data: {
    job_card_id?: string | number;
    deliveryDetail?: DeliveryDetail;
    prePressUnitList?: PrePressUnitList;
    binderyData?: BinderyData;
    paperData?: PaperData;
    prePressData?: PrePressData;
    plateDetailData?: PlateDetailData;
    paperDetailData?: PaperDetailData;
    pressUnitData?: PressUnitData;
    costCalculation?: CostCalculation;
  };
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ data }) => {
  if (!data) {
    console.error("No data provided to PDFGenerator");
    return null;
  }

  const formatCamelCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSimpleSection = (sectionData: { [key: string]: any }, title: string) => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{formatCamelCase(title)}</Text>
      {Object.entries(sectionData).map(([key, value]) => (
        <View style={styles.row} key={key}>
          <Text style={styles.label}>{formatCamelCase(key)}:</Text>
          <Text style={styles.value}>
            {typeof value === "object"
              ? Array.isArray(value)
                ? value.join(", ")
                : JSON.stringify(value)
              : key.toLowerCase().includes("date")
                ? formatDate(value as string)
                : value ?? ""}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderTable = (
    tableData: any[],
    title: string,
    columnCount: number,
    excludeFields: string[] = [],
    containerStyle = {}
  ) => (
    <View style={[styles.section, containerStyle]}>
      <Text style={styles.subtitle}>{formatCamelCase(title)}</Text>
      <View style={styles.table}>
        <View
          style={[
            styles.tableRow,
            { backgroundColor: "#e2e8f0", fontWeight: "bold" },
          ]}
        >
          {Object.keys(tableData[0])
            .filter((key) => !excludeFields.includes(key))
            .map((key) => (
              <View
                style={[
                  styles.tableCol,
                  { width: `${100 / (columnCount - excludeFields.length)}%` },
                ]}
                key={key}
              >
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  {formatCamelCase(key)}
                </Text>
              </View>
            ))}
        </View>
        {tableData.map((row, index) => (
          <View
            style={[
              styles.tableRow,
              index % 2 === 0 ? { backgroundColor: "white" } : {},
            ]}
            key={index}
          >
            {Object.entries(row)
              .filter(([key]) => !excludeFields.includes(key))
              .map(([key, value]) => (
                <View
                  style={[
                    styles.tableCol,
                    { width: `${100 / (columnCount - excludeFields.length)}%` },
                  ]}
                  key={key}
                >
                  <Text style={styles.tableCell}>
                    {key.toLowerCase().includes("date")
                      ? formatDate(value as string)
                      : value !== null && value !== undefined
                        ? String(value)
                        : ""}
                  </Text>
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );

  const renderCostCalculation = (costCalculation: CostCalculation) => {
    const { costCalculationId, billingInfo, ...otherFields } = costCalculation;
    return (
      <View style={styles.section}>
        <Text style={styles.subtitle}>Cost Calculation</Text>
        <View style={styles.table}>
          <View
            style={[
              styles.tableRow,
              { backgroundColor: "#e2e8f0", fontWeight: "bold" },
            ]}
          >
            <View style={[styles.tableCol, { width: "50%" }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Key
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "50%" }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Value
              </Text>
            </View>
          </View>
          {Object.entries(otherFields).map(([key, value], index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 === 0 ? { backgroundColor: "white" } : {},
              ]}
              key={key}
            >
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{formatCamelCase(key)}</Text>
              </View>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{value ?? ""}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={[styles.subtitle, { fontSize: 16, marginTop: 10 }]}>
          Billing Info
        </Text>
        <View style={styles.table}>
          <View
            style={[
              styles.tableRow,
              { backgroundColor: "#e2e8f0", fontWeight: "bold" },
            ]}
          >
            <View style={[styles.tableCol, { width: "50%" }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Key
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "50%" }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Value
              </Text>
            </View>
          </View>
          {Object.entries(billingInfo).map(([key, value], index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 === 0 ? { backgroundColor: "white" } : {},
              ]}
              key={key}
            >
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{formatCamelCase(key)}</Text>
              </View>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>
                  {key.toLowerCase().includes("date")
                    ? formatDate(value as string)
                    : value ?? ""}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Job Card Details</Text>
            <Text style={styles.jobCardId}>{`ID: ${data.job_card_id || 'N/A'}`}</Text>
          </View>
        </View>
        <View style={styles.flexContainer}>
          <View style={styles.column}>
            {data.deliveryDetail &&
              renderSimpleSection(data.deliveryDetail, "Delivery Details")}
            {data.prePressUnitList &&
              renderSimpleSection(data.prePressUnitList, "Payment and Service")}
            {data.binderyData &&
              renderSimpleSection(data.binderyData, "Bindery Data")}
          </View>
          <View style={styles.column}>
            {data.paperData &&
              renderSimpleSection(
                Object.fromEntries(
                  Object.entries(data.paperData.paperData0).filter(
                    ([key]) => key !== "paperData0_id"
                  )
                ),
                "Other Detail"
              )}
            {data.paperData &&
              data.paperData.paperData3 &&
              renderTable(
                data.paperData.paperData3,
                "Job Card Paper Detail",
                6,
                ["paperData3_id"]
              )}
          </View>
        </View>
        <View style={styles.flexContainer}>
          <View style={styles.column}>
            <View style={styles.flexContainer}>
              <View style={styles.column}>
                {data.prePressData &&
                  renderSimpleSection(
                    Object.fromEntries(
                      Object.entries(data.prePressData).filter(
                        ([key]) => key !== "prePressDataId"
                      )
                    ),
                    "Pre-Press Data"
                  )}
                {data.plateDetailData &&
                  renderSimpleSection(
                    Object.fromEntries(
                      Object.entries(data.plateDetailData).filter(
                        ([key]) =>
                          key !== "plateData" && key !== "plateDetailDataId"
                      )
                    ),
                    "Plate Detail Data"
                  )}
              </View>
              <View style={styles.column}>
                {data.paperDetailData &&
                  renderSimpleSection(data.paperDetailData, "Paper Details")}
              </View>
            </View>
            {data.plateDetailData &&
              data.plateDetailData.plateData &&
              renderTable(
                data.plateDetailData.plateData,
                "Plate Unit Data",
                8,
                ["plateDataId"]
              )}
            {data.paperData &&
              data.paperData.paperData1 &&
              renderTable(data.paperData.paperData1, "Full sheet size", 5)}
            {data.paperData &&
              data.paperData.paperData2 &&
              renderTable(data.paperData.paperData2, "Cut sheet size", 4)}
          </View>
          <View style={styles.column}>
            {data.pressUnitData &&
              renderSimpleSection(
                Object.fromEntries(
                  Object.entries(data.pressUnitData).filter(
                    ([key]) => key !== "pressData" && key !== "pressUnitDataId"
                  )
                ),
                "Press Unit Detail"
              )}
            {data.pressUnitData &&
              data.pressUnitData.pressData &&
              renderTable(data.pressUnitData.pressData, "Press Data", 6, [
                "pressDataId",
              ])}
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Job Card Details</Text>
            <Text style={styles.jobCardId}>{`ID: ${data.job_card_id || 'N/A'}`}</Text>
          </View>
        </View>
        <View style={styles.flexContainer}>
          <View style={styles.column}>
            {data.deliveryDetail &&
              renderSimpleSection(data.deliveryDetail, "Delivery Details")}
            {data.prePressUnitList &&
              renderSimpleSection(data.prePressUnitList, "Payment and Service")}
            {data.binderyData &&
              renderSimpleSection(data.binderyData, "Bindery Data")}
          </View>
          <View style={styles.column}>
            {data.paperData &&
              renderSimpleSection(
                Object.fromEntries(
                  Object.entries(data.paperData.paperData0).filter(
                    ([key]) => key !== "paperData0_id"
                  )
                ),
                "Other Detail"
              )}
            {data.paperData &&
              data.paperData.paperData3 &&
              renderTable(
                data.paperData.paperData3,
                "Job Card Paper Detail",
                6,
                ["paperData3_id"]
              )}
          </View>
        </View>
        {data.costCalculation && renderCostCalculation(data.costCalculation)}
      </Page>
    </Document>
  );
};

export default PDFGenerator;