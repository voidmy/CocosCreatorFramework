using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using OfficeOpenXml;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace ExcleToConfig
{

    public partial class Form1 : Form
    {
        private string fullName = string.Empty;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Debug.WriteLine("load====");
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial; // 非商业用途
            textBox1.ReadOnly = true;
            textBox1.Multiline = true;
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            ClearState();

            //定义一个文件打开控件
           OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "Excel Files|*.xls;*.xlsx;*.xlsm"; // 只接受Excel文件
            ofd.Title = "请选择一个Excel文件";

            if (ofd.ShowDialog() == DialogResult.OK)
            {
                string selectedFileName = ofd.FileName;
                // 处理选定的Excel文件（如：读取内容）
                Debug.WriteLine("name:"+ofd.FileName);
                fullName = ofd.FileName;
                var button = sender as System.Windows.Forms.Button;
                button.Text = Path.GetFileName(ofd.FileName);
                AddDropbox(ofd.FileName);
            }
        }

        private void ClearState()
        {
            comboBox1.Items.Clear();
            comboBox1.SelectedItem = null;
            comboBox1.SelectedIndex = -1;
            comboBox1.Refresh();
            dataGridView1.DataSource = null;

            // 强制更新 UI
            dataGridView1.Refresh();
        }

        private void AddDropbox(string excelFilePath)
        {
            using (var package = new ExcelPackage(new FileInfo(excelFilePath)))
            {
                foreach (var worksheet in package.Workbook.Worksheets)
                {
                    comboBox1.Items.Add(worksheet.Name);
                }
            }
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboBox1.SelectedItem != null)
            {
                string selectedWorksheetName = comboBox1.SelectedItem.ToString();
                // 创建一个新的DataTable实例
                DataTable dt = new DataTable();

                using (var package = new ExcelPackage(new FileInfo(fullName)))
                {
                    var worksheet = package.Workbook.Worksheets[selectedWorksheetName];

                    // 填写DataTable对象的列名
                    for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                    {
                        dt.Columns.Add((string)worksheet.Cells[1, col].Value);
                    }

                    // 遍历工作表的每一行
                    for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                    {
                        DataRow dr = dt.NewRow();
                        // 遍历该行的每一列
                        for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                        {
                            if (worksheet.Cells[row, col].Value != null)
                            {
                                dr[col - 1] = worksheet.Cells[row, col].Value.ToString();
                            }
                        }
                        dt.Rows.Add(dr);
                    }
                }

                // 绑定DataGridView
                dataGridView1.DataSource = dt;

                // 强制更新 UI
                dataGridView1.Refresh();
            }
        }

        private List<string> jsonKeys = new List<string>();

        private void button2_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(fullName))
            {
                string selectedWorksheetName = comboBox1.SelectedItem.ToString();
                using (var package = new ExcelPackage(new FileInfo(fullName)))
                {
                    var worksheet = package.Workbook.Worksheets[selectedWorksheetName];
                    var dimension = worksheet.Dimension;
                    // 遍历工作表的每一行
                    int beginIndex = 0;
                    int endIndex = 0;
                    for (int row = 1; row <= dimension.End.Row; row++)
                    {
                        var val=worksheet.Cells[row, 1].Value;
                        if (val == null) continue;
                        if ((string)val == "/Var")
                        {
                            SetJosnKey(worksheet, row);
                            continue;
                        }
                        if ((string)val == "/Begin")
                        {
                            endIndex=beginIndex = row;
                            continue;
                        }
                        if ((string)val == "/End")
                        {
                            endIndex = row;
                            break;
                        }
                    }
                    int endCol = strKeys.Count +1;
                    string jsonStrMax = "[";
                    for (int row = beginIndex; row <= endIndex; row++)
                    {
                        int index = 0;
                        string jsonStr = "";
                        // 遍历该行的每一列
                        string L10n = "";
                        for (int col = 2; col <= endCol; col++)
                        {
                            var cell = worksheet.Cells[row, col].Value;
                            string val = string.Empty;
                            if (cell != null) val = cell.ToString();
                            
                            if (index == 0)
                            {
                                jsonStr += "{";
                            }
                            if (strKeys[index].valType.Contains('@'))
                            {
                                jsonStr += GetKeyL10nVla(strKeys[index], val);
                            }
                            else
                            {
                                jsonStr += GetKeyVla(strKeys[index], val);
                            }
                              
                            if (col != endCol)
                            {
                                jsonStr += ",";
                            }
                            if (col == endCol)
                            {
                                jsonStr += "}";
                            }
                            index++;
                        }

                        jsonStrMax += jsonStr;
                        if (row < endIndex)
                            jsonStrMax += ",";
                    }
                    jsonStrMax += "]";
                    Log("===jsonStrMax==== ");
                    Log(jsonStrMax);
                    //Log("===excel to json==== ");
                    ChooseOutPutPath(jsonStrMax, selectedWorksheetName+".json");
                }
            }
            else
            {
                ShowTips("请选择表格!!!");
                Log("请选择表格!!!");
            }
        }

        private void ShowTips(string mes, MessageBoxButtons boxButtons= MessageBoxButtons.YesNo)
        {
            DialogResult dr = MessageBox.Show(this, mes, "提示", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            //如果消息框返回值是Yes，显示新窗体
            if (dr == DialogResult.Yes)
            {
                // MessageForm messageForm = new MessageForm();
                // messageForm.Show();
                Debug.WriteLine("yes");
                //this.Close();
            }
            //如果消息框返回值是No，关闭当前窗体
            else if (dr == DialogResult.No)
            {
                //关闭当前窗体
                //this.Close();
            }
        }

        private void ChooseOutPutPath(string jsonString, string fileName)
        {
            using (var fbd = new FolderBrowserDialog())
            {
                // 设置初始目录为上次选择的目录
               fbd.SelectedPath = Properties.Settings.Default.LastSelectedPath;

                DialogResult result = fbd.ShowDialog();

                if (result == DialogResult.OK && !string.IsNullOrWhiteSpace(fbd.SelectedPath))
                {
                    string selectedPath = fbd.SelectedPath;
                   // MessageBox.Show("Selected Folder: " + selectedPath);
                    // 保存用户的选择
                    Properties.Settings.Default.LastSelectedPath = selectedPath;
                    Properties.Settings.Default.Save();
                    // Use selectedPath as the directory to save your file
                    WriteTxtToFile(jsonString, selectedPath, fileName);
                    ShowTips("excel to json success!!!", MessageBoxButtons.OK);
                    Log("===excel to json success!!!==== ");
                }
            }
        }

        public void WriteTxtToFile(string jsonString, string directoryPath, string fileName)
        {

            // 确保路径最后有一个斜杠
            if (!directoryPath.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                directoryPath += Path.DirectorySeparatorChar;
            }

            // 创建文件全名（包含路径）
            string fullPath = directoryPath + fileName;

            // 如果目标目录不存在，则创建目录
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            // 将json字符串写入文件
            File.WriteAllText(fullPath, jsonString);
            Log("create file success! path:"+ fullPath);
        }

        private string GetKeyVla(StrKey strKey,string val)
        {
            if(strKey.valType== "num"|| strKey.valType == "Tarr"||"arr" == strKey.valType)
                return $@"""{strKey.KeyName}"":{val}";
             return $@"""{strKey.KeyName}"":""{val}""";
        }

        private string GetKeyL10nVla(StrKey strKey, string val)
        {
           string suffix="_"+strKey.valType.Replace("@", "");
            return $@"""{strKey.KeyName+ suffix}"":""{val}""";
        }

        private List<StrKey> strKeys = new List<StrKey>();
        private void SetJosnKey(ExcelWorksheet sheet,int row)
        {
            strKeys.Clear();
            for (int column =2; column <= sheet.Dimension.End.Column; column++)
            {
                var val = sheet.Cells[row, column].Value;
                if (val!=null)
                {
                    //jsonKeys.Add((string)val);
                    DealKey((string)val);
                }
            }
            Log(string.Join(", ", jsonKeys));//ID, Type(C_e), EventID(C_num), Name(C_str), drap(_arr), award(_Tarr)  
        }

        private void DealKey(string key)
        {
            string source = key;// "EventID(C_num)";
            string pattern = @"\((.+)\)";  // 正则表达式，匹配括号及括号内的内容
            StrKey strKey=new StrKey();
            // 使用正则表达式从源字符串中获取括号内的内容
            Match match = Regex.Match(source, pattern);
            if (match.Success)
            {
                string contentInBrackets = match.Groups[1].Value;   // 括号内的内容
                                                                    // Console.WriteLine(contentInBrackets);  // 输出: C_num
                var result = contentInBrackets.Split('_');
                strKey.KeyType = result[0];
                strKey.valType = result[1];
            }

            // 移除源字符串中的括号及括号内的内容
            string target = ""; // 用于替换的目标字符串，这里是空字符串
            string KeyName = Regex.Replace(source, pattern, target);
            //Console.WriteLine(result);  // 输出: EventID
            strKey.KeyName = KeyName;
            strKeys.Add(strKey);
        }

        private void DealRow()
        {

        }

        private void Log(string mes)
        {
            textBox1.AppendText($"{mes}{Environment.NewLine}");
            textBox1.SelectionStart = textBox1.Text.Length;
            textBox1.ScrollToCaret();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            using (var fbd = new FolderBrowserDialog())
            {
                string selectedWorksheetName = comboBox1.SelectedItem.ToString();
                // 设置初始目录为上次选择的目录
                fbd.SelectedPath = Properties.Settings.Default.LastTSSelectedPath;

                DialogResult result = fbd.ShowDialog();

                if (result == DialogResult.OK && !string.IsNullOrWhiteSpace(fbd.SelectedPath))
                {
                    string selectedPath = fbd.SelectedPath;
                    // MessageBox.Show("Selected Folder: " + selectedPath);
                    // 保存用户的选择
                    Properties.Settings.Default.LastTSSelectedPath = selectedPath;
                    Properties.Settings.Default.Save();
                    // Use selectedPath as the directory to save your file
                    // WriteTxtToFile(jsonString, selectedPath, fileName);
                   string txt= GenerateCode(selectedWorksheetName);
                    WriteTxtToFile(txt, selectedPath, selectedWorksheetName+"Config.ts");
                    ShowTips("create ts  success!!!", MessageBoxButtons.OK);
                    Log("===create ts  success!!!==== ");
                }
            }
        }
        public string GetTypeDef(string type)
        {
            switch (type)
            {
                case "num":
                    return "number";
                case "arr":
                    return "ReadonlyArray<number>[]";
                case "Tarr":
                    return "ReadonlyArray<number>[][]";
                default:
                    return "string";
            }
        }

        public string GenerateCode(string className)
        {
            var fieldDeclarations = new StringBuilder();
            var assignments = new StringBuilder();
            var fielL10n = new StringBuilder();
            string GetFuncType = "number";
            var dicL10n = new Dictionary<string, bool>();
            foreach (var field in strKeys)
            {
                // 类属性声明
                if (field.KeyName == "ID")
                {
                    GetFuncType = field.valType == null ? "number" : GetTypeDef(field.valType);
                    fieldDeclarations.AppendLine($"public readonly {field.KeyName}: {GetFuncType};");
                }
                else
                {
                    if (field.valType.Contains("@"))
                    {
                        if (!dicL10n.ContainsKey(field.KeyName))
                        {
                            dicL10n.Add(field.KeyName, true);
                        }
                        string suffix = "_" + field.valType.Replace("@", "");
                        fieldDeclarations.AppendLine($"public readonly {field.KeyName+suffix}: {GetTypeDef(field.valType)};");
                    }
                    else
                    {
                        fieldDeclarations.AppendLine($"public readonly {field.KeyName}: {GetTypeDef(field.valType)};");
                    }

                }
                // Json 赋值
                if (field.valType.Contains("@"))
                {
                    string suffix = "_" + field.valType.Replace("@", "");
                    assignments.AppendLine($"this.{field.KeyName+ suffix} = item.{field.KeyName+ suffix};");
                }
                else
                {
                    assignments.AppendLine($"this.{field.KeyName} = item.{field.KeyName};");
                }

            };
            foreach (var kv in dicL10n)
            {
                fielL10n.AppendLine($@"public get {kv.Key}(){{return this[""{kv.Key}_""+__L10n];}}");
            }
            return $@"
import {{ Director, Prefab, Node, instantiate, resources, JsonAsset }} from 'cc';

export class {className}Config {{

     {fieldDeclarations.ToString()}
     {fielL10n.ToString()}

    constructor(item: any) {{
        {assignments.ToString()}
    }}

    private static _dict = {"{"}  {"}"};
    public static Get(ID: {GetFuncType}) {{
        return this._dict[ID];
    }}
    public static load():Promise<boolean>{{
        return new Promise((resolve, reject) => {{ 
        resources.load('Json/{className}', (err, aset) => {{
            if(err){{
                console.log(err.message);
                reject(false);
                return;
            }};
            let assetobj = aset as JsonAsset;
            let json = assetobj.json;
            json.forEach(item => {{
                let cf = new {className}Config(item);
                this._dict[item.ID] = cf;
             }});
             resolve(true);
            }});
         }});
     }}
}}";
        }
    }

    public struct StrKey
    {
        // key name
        public string KeyName ;
        // key 类型 C 客户端 S 服务器 null 两个都要
        public string KeyType;
        // 当前 key val 类型 num str arr Tarr
        public string valType;
    }
}
