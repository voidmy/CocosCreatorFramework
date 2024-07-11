using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ExcleToConfig
{
    public partial class Tips : Form
    {
        public Tips()
        {
            InitializeComponent();
        }

        private void Tips_MouseDown(object sender, MouseEventArgs e)
        {
            DialogResult dr = MessageBox.Show("是否打开新窗体？", "提示", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            //如果消息框返回值是Yes，显示新窗体
            if (dr == DialogResult.Yes)
            {
                // MessageForm messageForm = new MessageForm();
                // messageForm.Show();
                Debug.WriteLine("yes");
            }
            //如果消息框返回值是No，关闭当前窗体
            else if (dr == DialogResult.No)
            {
                //关闭当前窗体
                this.Close();
            }
        }

        private void Tips_Load(object sender, EventArgs e)
        {

        }
    }
}
