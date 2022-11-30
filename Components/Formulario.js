import React from "react";
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View
} from "react-native";
import { DatePicker } from "react-native-woodpicker";
import SelectDropdown from "react-native-select-dropdown";

const heightY = Dimensions.get("window").height;
const widthX = Dimensions.get("window").width;
const Formulario = ({ ingreso, setIngreso }) => {
const handleDate = (date) => {
    if(!date) {return "Seleccione una fecha"}
    const ano= date.getFullYear()
    const mes=date.getMonth()+1
    const day=date.getDate()
    return day+"/"+mes+"/"+ano
  }
const colorData = ["Auto", "Rojo", "Verde", "Naranja", "Amarillo"]  

  return (
    <>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Nº RENFO</Text>
        <TextInput
          style={styles.input2}
          name="Renfo"
          value={ingreso.Renfo}
          onChangeText={(value) => setIngreso({ ...ingreso, Renfo: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Nombre</Text>
        <TextInput
          style={styles.input2}
          name="Nombre"
          value={ingreso.Nombre}
          onChangeText={(value) => setIngreso({ ...ingreso, Nombre: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Localidad</Text>
        <TextInput
          style={styles.input2}
          name="Localidad"
          value={ingreso.Localidad}
          onChangeText={(value) => setIngreso({ ...ingreso, Localidad: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Titular</Text>
        <TextInput
          style={styles.input2}
          name="Titular"
          value={ingreso.Titular}
          onChangeText={(value) => setIngreso({ ...ingreso, Titular: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Telefono Titular</Text>
        <TextInput
          style={styles.input2}
          keyboardType="phone-pad"
          name="Teltitular"
          value={ingreso.Teltitular}
          onChangeText={(value) => setIngreso({ ...ingreso, Teltitular: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Responsable técnico </Text>
        <TextInput
          style={styles.input2}
          name="RespTecnico"
          value={ingreso.RespTecnico}
          onChangeText={(value) => setIngreso({ ...ingreso, RespTecnico: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Teléfono Resp. Téc. </Text>
        <TextInput
          style={styles.input2}
          keyboardType="phone-pad"
          name="TelRespTecnico"
          value={ingreso.TelRespTecnico}
          onChangeText={(value) => setIngreso({ ...ingreso, TelRespTecnico: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Correo Electronico</Text>
        <TextInput
          style={styles.input2}
          keyboardType="email-address"
          name="Mail"
          value={ingreso.Mail}
          onChangeText={(value) => setIngreso({ ...ingreso, Mail: value })}
        ></TextInput>
      </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Exp. Electrónico</Text>
        <TextInput
          style={styles.input2}
          name="ExpElec"
          value={ingreso.ExpElec}
          onChangeText={(value) => setIngreso({ ...ingreso, ExpElec: value })}
        ></TextInput>
      </SafeAreaView>
      <View style={styles.formulario}>
        <Text style={styles.text}> Fecha habilitación </Text>
        <DatePicker
          value={ingreso.FechaHabilitacion}
          onDateChange={(date) => setIngreso({ ...ingreso, FechaHabilitacion: date })}
          title="Date Picker"
          text={handleDate(ingreso.FechaHabilitacion)}
          isNullable={false}
          style={styles.pickerStyle}
          androidDisplay="default"
          textInputStyle={styles.textPicker}
        />
      </View>
      <View style={styles.formulario}>
        <Text style={styles.text}> Fecha de Vencimiento</Text>
        <DatePicker
          value={ingreso.Vencimiento}
          onDateChange={(date) => setIngreso({ ...ingreso, Vencimiento: date })}
          title="Date Picker"
          text={handleDate(ingreso.Vencimiento)}
          isNullable={false}
          style={styles.pickerStyle}
          androidDisplay="default"
          textInputStyle={styles.textPicker}
        />
      </View>
      <View style={styles.formulario}>
        <Text style={styles.text}> Fecha de Notificación</Text>
        <DatePicker
          value={ingreso.Notificacion}
          onDateChange={(date) => setIngreso({ ...ingreso, Notificacion: date })}
          title="Date Picker"
          text={handleDate(ingreso.Notificacion)}
          isNullable={false}
          style={styles.pickerStyle}
          androidDisplay="default"
          textInputStyle={styles.textPicker}
        />
      </View>
      <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Color </Text>
          <SelectDropdown
            data={colorData}
            buttonStyle={styles.dropdown}
            onSelect={(selectedItem, index) => {setIngreso({ ...ingreso, Color: index })         
            }}
            dropdownStyle={{ marginStart: "10%", width: "30%" }}
            defaultValueByIndex={ingreso.Color}
          />
        </SafeAreaView>
      <SafeAreaView style={styles.formulario}>
        <Text style={styles.text}> Observaciones</Text>
        <TextInput
          style={styles.input3}
          multiline
          value={ingreso.Observaciones}
          onChangeText={(value) =>
            setIngreso({ ...ingreso, Observaciones: value })
          }
        ></TextInput>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  formulario: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: heightY * 0.0225,
    width: "49%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    minHeight: 60,
  },
  input2: {
    height: 50,
    borderWidth: 0.5,
    padding: 10,
    width: '49%',
    // minWidth: "49%",
    fontSize: heightY * 0.023,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#ffffff90",

  },
  input3: {
    height: 'auto',
    borderWidth: 0.5,
    padding: 10,
    width: "49%",
    fontSize: heightY * 0.023,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#ffffff90",
  },
  pickerStyle: {
    height: 50,
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
    width: widthX * 0.5,
    marginTop: 10,
    textAlign: "center",
    alignContent: "center",
  },
  textPicker: {
    alignSelf: "center",
    fontSize: heightY * 0.02,
  },
  dropdown: {
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Formulario;
