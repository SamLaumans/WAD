using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace officecallendar.backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAttendancesWithCreator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "creator_username",
                table: "Attendances",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_creator_username",
                table: "Attendances",
                column: "creator_username");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Users_creator_username",
                table: "Attendances",
                column: "creator_username",
                principalTable: "Users",
                principalColumn: "username",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Users_creator_username",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_creator_username",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "creator_username",
                table: "Attendances");
        }
    }
}
