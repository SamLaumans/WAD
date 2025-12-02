using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace officecallendar.backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAttendancesWithVisible : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "visible",
                table: "Attendances",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "visible",
                table: "Attendances");
        }
    }
}
